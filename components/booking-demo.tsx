"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
});

const times = Array.from({ length: 16 }, (_, i) => {
  const hour = 9 + Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  return timeFormatter.format(new Date(`2026-09-01T${String(hour).padStart(2, "0")}:${minute}:00Z`));
});

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type MonthKey = "current" | "next";

function toKey(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function monthLabel(year: number, month: number) {
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(
    new Date(year, month, 1),
  );
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function BookingDemo() {
  const [step, setStep] = useState(1);
  const [viewMonth, setViewMonth] = useState<MonthKey>("current");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    petName: "",
    phone: "",
    email: "",
  });

  const detailsComplete =
    form.firstName.trim() !== "" &&
    form.lastName.trim() !== "" &&
    form.petName.trim() !== "" &&
    form.phone.trim() !== "" &&
    form.email.trim() !== "";

  const setField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const today = startOfToday();
  const todayKey = toKey(today.getFullYear(), today.getMonth()) + "-" + String(today.getDate()).padStart(2, "0");
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

  const month = viewMonth === "current" ? currentMonth : nextMonth;
  const year = viewMonth === "current" ? currentYear : nextYear;

  const lastDayOfNext = new Date(nextYear, nextMonth + 1, 0);

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dates = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(year, month, i + 1);
    return {
      key: toKey(d.getFullYear(), d.getMonth()),
      value: toKey(d.getFullYear(), d.getMonth()) + "-" + String(d.getDate()).padStart(2, "0"),
      day: d.getDate(),
      disabled: d < today || d > lastDayOfNext,
    };
  });

  const cells: (typeof dates[number] | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...dates,
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const rows: (typeof cells)[] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  const selectDate = (value: string) => {
    setSelectedDate(value);
    setSelectedTime("");
  };

  const switchMonth = (key: MonthKey) => {
    if (key !== viewMonth) {
      setViewMonth(key);
      setSelectedDate("");
      setSelectedTime("");
    }
  };

  const readableDate = (value: string) => {
    if (!value) return "";
    const [year, month, day] = value.split("-").map(Number);
    if (!year || !month || !day) return "";
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(new Date(year, month - 1, day));
  };

  return (
    <section className="booking-card" aria-labelledby="booking-title">
      <div
        className="booking-progress"
        role="progressbar"
        aria-label="Booking progress"
        aria-valuemin={1}
        aria-valuemax={3}
        aria-valuenow={step}
        aria-valuetext={`Step ${step} of 3`}
      >
        {[1, 2, 3].map((item) => (
          <span key={item} className={item <= step ? "active" : ""} />
        ))}
      </div>
      {step === 1 && (
        <div className="booking-step">
          <p className="step-label">Step 1 of 3</p>
          <h2 id="booking-title">Choose a visit</h2>
          <p className="booking-helper">Pick a day and time. Bookings open for this month and next.</p>
          <div className="calendar-switcher" role="tablist" aria-label="Choose a month">
            {(["current", "next"] as const).map((key) => {
              const m = key === "current" ? currentMonth : nextMonth;
              const y = key === "current" ? currentYear : nextYear;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={viewMonth === key}
                  className={viewMonth === key ? "selected" : ""}
                  onClick={() => switchMonth(key)}
                >
                  {monthLabel(y, m)}
                </button>
              );
            })}
          </div>
          <fieldset>
            <legend>Select a day</legend>
            <div className="calendar-grid" role="grid" aria-label={monthLabel(year, month)}>
              <div role="row" className="calendar-head-row">
                {WEEKDAYS.map((weekday) => (
                  <span role="columnheader" className="calendar-weekday" key={weekday} aria-label={weekday}>
                    {weekday}
                  </span>
                ))}
              </div>
              {rows.map((row, rowIndex) => (
                <div role="row" className="calendar-row" key={`row-${rowIndex}`}>
                  {row.map((date, cellIndex) =>
                    date ? (
                      <button
                        type="button"
                        role="gridcell"
                        key={date.value}
                        className={[
                          "calendar-day",
                          date.disabled ? "disabled" : "",
                          selectedDate === date.value ? "selected" : "",
                          date.value === todayKey ? "today" : "",
                        ].filter(Boolean).join(" ")}
                        onClick={() => !date.disabled && selectDate(date.value)}
                        disabled={date.disabled}
                        aria-label={readableDate(date.value)}
                        aria-selected={selectedDate === date.value}
                        aria-disabled={date.disabled || undefined}
                      >
                        {date.day}
                      </button>
                    ) : (
                      <span role="gridcell" className="calendar-empty" key={`empty-${rowIndex}-${cellIndex}`} aria-hidden="true" />
                    ),
                  )}
                </div>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Select a time</legend>
            {selectedDate ? (
              <div className="time-options">
                {times.map((time) => (
                  <button
                    type="button"
                    key={time}
                    className={selectedTime === time ? "selected" : ""}
                    onClick={() => setSelectedTime(time)}
                    aria-pressed={selectedTime === time}
                  >
                    {time}
                  </button>
                ))}
              </div>
            ) : (
              <p className="booking-helper time-prompt">Choose a day above to see available times.</p>
            )}
          </fieldset>
          <div className="booking-selection">
            <span>Selected</span>
            <strong>{selectedDate ? `${readableDate(selectedDate)}, ${selectedTime || "pick a time"}` : "No date chosen yet"}</strong>
          </div>
          <button
            type="button"
            className="button button-primary booking-next"
            onClick={() => setStep(2)}
            disabled={!selectedDate || !selectedTime}
          >
            Continue to your details <ArrowIcon />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="booking-step">
          <p className="step-label">Step 2 of 3</p>
          <h2 id="booking-title">Almost there.</h2>
          <p className="booking-helper">{readableDate(selectedDate)}, {selectedTime} · Self-serve wash</p>
          <form onSubmit={(event) => { event.preventDefault(); setStep(3); }}>
            <div className="booking-fields">
              <label className="field-label" htmlFor="first-name">First name</label>
              <input
                id="first-name"
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={(event) => setField("firstName", event.target.value)}
                placeholder="e.g. Alex"
                autoComplete="given-name"
                required
              />
              <label className="field-label" htmlFor="last-name">Last name</label>
              <input
                id="last-name"
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={(event) => setField("lastName", event.target.value)}
                placeholder="e.g. Rivera"
                autoComplete="family-name"
                required
              />
              <label className="field-label" htmlFor="pet-name">Pet’s name</label>
              <input
                id="pet-name"
                name="petName"
                type="text"
                value={form.petName}
                onChange={(event) => setField("petName", event.target.value)}
                placeholder="e.g. Mochi…"
                maxLength={30}
                autoComplete="off"
                required
              />
              <label className="field-label" htmlFor="phone">Phone number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={(event) => setField("phone", event.target.value)}
                placeholder="e.g. (555) 123-4567"
                autoComplete="tel"
                required
              />
              <label className="field-label" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={(event) => setField("email", event.target.value)}
                placeholder="e.g. alex@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="booking-button-row">
              <button type="button" className="button button-ghost" onClick={() => setStep(1)}>Back</button>
              <button type="submit" className="button button-primary" disabled={!detailsComplete}>
                Confirm booking <ArrowIcon />
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="booking-step booking-review">
          <p className="step-label">Step 3 of 3</p>
          <h2 id="booking-title">Looks fresh.</h2>
          <div className="review-dog" aria-hidden="true">🐾</div>
          <dl>
            <div><dt>Guest</dt><dd>{form.petName.trim()}</dd></div>
            <div><dt>Visit</dt><dd>{readableDate(selectedDate)}, {selectedTime}</dd></div>
            <div><dt>Service</dt><dd>Self-serve wash</dd></div>
            <div><dt>Payment</dt><dd>Pay in store</dd></div>
          </dl>
          <div className="demo-notice">
            <strong>Reservation confirmed</strong>
            <span>We’ll hold your tub and see you then.</span>
          </div>
          <div className="booking-button-row">
            <button type="button" className="button button-ghost" onClick={() => setStep(2)}>Edit details</button>
            <Link href="/" className="button button-primary">Return home <ArrowIcon /></Link>
          </div>
        </div>
      )}
    </section>
  );
}
