"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { ArrowIcon, CheckIcon } from "@/components/icons";

const PHONE_RE = /^(\d{10}|\d{3}-\d{3}-\d{4})$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/heic", "image/heif", "application/pdf"];
const MAX_FILE_MB = 2;

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function VaccineForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    petName: "",
    phone: "",
    email: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState("");
  const [fileError, setFileError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const previewURL = useRef("");

  useEffect(() => {
    return () => {
      if (previewURL.current) URL.revokeObjectURL(previewURL.current);
    };
  }, []);

  const phoneValid = PHONE_RE.test(form.phone.trim());
  const emailValid = EMAIL_RE.test(form.email.trim());

  const formComplete =
    form.firstName.trim() !== "" &&
    form.lastName.trim() !== "" &&
    form.petName.trim() !== "" &&
    phoneValid &&
    emailValid &&
    file !== null &&
    fileError === "";

  const setField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const clearPreview = () => {
    if (previewURL.current) URL.revokeObjectURL(previewURL.current);
    previewURL.current = "";
    setFilePreview("");
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    setFileError("");
    if (!selected) return;
    if (!ALLOWED_TYPES.includes(selected.type)) {
      setFile(null);
      clearPreview();
      setFileError("Please upload a photo (JPG, PNG, HEIC) or PDF.");
      return;
    }
    if (selected.size > MAX_FILE_MB * 1024 * 1024) {
      setFile(null);
      clearPreview();
      setFileError(`That file is over ${MAX_FILE_MB} MB. Please upload a smaller copy.`);
      return;
    }
    setFile(selected);
    clearPreview();
    if (selected.type.startsWith("image/")) {
      const url = URL.createObjectURL(selected);
      previewURL.current = url;
      setFilePreview(url);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formComplete || submitting || !file) return;
    setSubmitting(true);
    setError("");
    try {
      const context = [
        `owner_first=${encodeURIComponent(form.firstName.trim())}`,
        `owner_last=${encodeURIComponent(form.lastName.trim())}`,
        `pet_name=${encodeURIComponent(form.petName.trim())}`,
        `phone=${encodeURIComponent(form.phone.trim())}`,
        `email=${encodeURIComponent(form.email.trim())}`,
        `record_format=${encodeURIComponent(file.type)}`,
      ].join("|");
      const cloudinaryBody = new FormData();
      cloudinaryBody.append("file", file);
      cloudinaryBody.append("upload_preset", "dog_wash");
      cloudinaryBody.append("context", context);
      cloudinaryBody.append("tags", form.petName.trim());
      const cloudRes = await fetch("/api/upload", {
        method: "POST",
        body: cloudinaryBody,
      });
      if (!cloudRes.ok) {
        throw new Error("Uploading the card failed. Please try again.");
      }
      const cloudData = (await cloudRes.json()) as { secure_url?: string };
      let cardUrl = cloudData.secure_url ?? "";
      if (cardUrl) {
        if (file.type === "application/pdf") {
          cardUrl = cardUrl.replace("/image/upload/", "/image/upload/pg_1/f_jpg/");
        } else if (file.type === "image/heic" || file.type === "image/heif") {
          cardUrl = cardUrl.replace("/image/upload/", "/image/upload/f_jpg/");
        }
      }

      const content = [
        "**🐾 New vaccination record**",
        "",
        `🐕 Pet's name: **${form.petName.trim()}**`,
        `👤 Owner's name: **${form.firstName.trim()} ${form.lastName.trim()}**`,
        `📞 Phone: ${form.phone.trim()}`,
        `✉️ Email: ${form.email.trim()}`,
      ].join("\n");
      const discordBody = new FormData();
      discordBody.append("content", content);
      discordBody.append("file", file);
      const discordRes = await fetch("/api/discord", {
        method: "POST",
        body: discordBody,
      });
      if (!discordRes.ok) {
        throw new Error("We couldn’t send your card to the team. Please try again.");
      }

      const record = {
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        pet_name: form.petName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        card_url: cardUrl,
        file_name: file.name,
        uploaded_at: new Date().toISOString(),
      };
      const recordRes = await fetch("/api/vaccine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
      if (!recordRes.ok) {
        throw new Error("We couldn’t save your records. Please try again.");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="booking-card" aria-labelledby="vaccine-title">
      <div className="booking-progress" role="progressbar" aria-label="Record sharing progress" aria-valuemin={1} aria-valuemax={3} aria-valuenow={submitted ? 3 : 1}>
        <span className={submitted ? "active" : ""} />
        <span className={submitted ? "active" : ""} />
        <span className={submitted ? "active" : ""} />
      </div>

      {submitted ? (
        <div className="booking-step booking-review">
          <p className="step-label">Records received</p>
          <h2>All set.</h2>
          <div className="review-dog" aria-hidden="true">
            <CheckIcon />
          </div>
          <p className="booking-helper">We’ve got {form.petName.trim()}&apos;s vaccine record and your contact details.</p>
          <dl>
            <div><dt>Owner</dt><dd>{form.firstName.trim()} {form.lastName.trim()}</dd></div>
            <div><dt>Pet</dt><dd>{form.petName.trim()}</dd></div>
            <div><dt>Phone</dt><dd>{form.phone.trim()}</dd></div>
            <div><dt>Email</dt><dd>{form.email.trim()}</dd></div>
            <div><dt>Record</dt><dd>{file?.name}</dd></div>
          </dl>
          <div className="demo-notice">
            <strong>We’ll review it before your visit</strong>
            <span>You can still walk in anytime — this just helps us be ready for your pup.</span>
          </div>
          <div className="booking-button-row">
            <Link href="/" className="button button-primary">Return home <ArrowIcon /></Link>
          </div>
        </div>
      ) : (
        <div className="booking-step vaccine-step">
          <p className="step-label">Pup records</p>
          <h2 id="vaccine-title">Before the splash.</h2>
          <p className="booking-helper">
            Add your contact details and upload your pet’s vaccination card. No account needed.
          </p>
          <form onSubmit={handleSubmit} noValidate>
            <div className="booking-fields">
              <label className="field-label" htmlFor="vaccine-first-name">First name</label>
              <input
                id="vaccine-first-name"
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={(event) => setField("firstName", event.target.value)}
                placeholder="e.g. Alex"
                autoComplete="given-name"
                required
              />
              <label className="field-label" htmlFor="vaccine-last-name">Last name</label>
              <input
                id="vaccine-last-name"
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={(event) => setField("lastName", event.target.value)}
                placeholder="e.g. Rivera"
                autoComplete="family-name"
                required
              />
              <label className="field-label" htmlFor="vaccine-pet-name">Pet’s name</label>
              <input
                id="vaccine-pet-name"
                name="petName"
                type="text"
                value={form.petName}
                onChange={(event) => setField("petName", event.target.value)}
                placeholder="e.g. Mochi…"
                maxLength={30}
                autoComplete="off"
                required
              />
              <label className="field-label" htmlFor="vaccine-phone">Phone number</label>
              <input
                id="vaccine-phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={(event) => setField("phone", event.target.value)}
                placeholder="e.g. 5551234567 or 555-123-4567"
                autoComplete="tel"
                required
                aria-invalid={form.phone.trim() !== "" && !phoneValid}
              />
              {form.phone.trim() !== "" && !phoneValid && (
                <p className="field-error" role="alert">
                  Enter 10 digits (e.g. 5551234567 or 555-123-4567).
                </p>
              )}
              <label className="field-label" htmlFor="vaccine-email">Email</label>
              <input
                id="vaccine-email"
                name="email"
                type="email"
                value={form.email}
                onChange={(event) => setField("email", event.target.value)}
                placeholder="e.g. alex@example.com"
                autoComplete="email"
                required
                aria-invalid={form.email.trim() !== "" && !emailValid}
              />
              {form.email.trim() !== "" && !emailValid && (
                <p className="field-error" role="alert">
                  Enter a valid email (e.g. alex@example.com).
                </p>
              )}
            </div>

            <fieldset className="vaccine-upload-fieldset">
              <legend className="field-label">Vaccination card</legend>
              <label className={`vaccine-upload${file ? " has-file" : ""}`}>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/heic,image/heif,application/pdf,.jpg,.jpeg,.png,.heic,.pdf"
                  onChange={handleFileChange}
                  className="vaccine-upload-input"
                />
                {file ? (
                  <>
                    <CheckIcon />
                    <strong>{file.name}</strong>
                    <span>{formatBytes(file.size)} · tap to change</span>
                  </>
                ) : (
                  <>
                    <strong>Tap to upload a vaccine card</strong>
                    <span>Photo (JPG, PNG, HEIC) or PDF · up to 2 MB</span>
                  </>
                )}
              </label>
              {filePreview && (
                // eslint-disable-next-line @next/next/no-img-element -- user-uploaded blob preview, not optimizable by next/image
                <img className="vaccine-file-preview" src={filePreview} alt="Preview of the uploaded vaccine card" />
              )}
              {fileError && <p className="field-error" role="alert">{fileError}</p>}
            </fieldset>

            <p className="vaccine-note">
              <CheckIcon />
              <span>NYC Health Code requires us to keep proof of vaccinations on file before grooming your pup. Your card goes straight to our team — it’s never posted publicly.</span>
            </p>

            <div className="booking-button-row">
              <Link href="/" className="button button-ghost">Cancel</Link>
              <button type="submit" className="button button-primary" disabled={!formComplete || submitting}>
                {submitting ? "Sending…" : "Submit records"} <ArrowIcon />
              </button>
            </div>
            {error && <p className="booking-error" role="alert">{error}</p>}
          </form>
        </div>
      )}
    </section>
  );
}