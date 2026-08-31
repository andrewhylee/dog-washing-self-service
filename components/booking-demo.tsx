"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowIcon, CheckIcon } from "@/components/icons";

const sampleDates = ["2026-08-30", "2026-08-31", "2026-09-01", "2026-09-02"];
const dayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" });
const dateFormatter = new Intl.DateTimeFormat("en-US", { day: "2-digit", timeZone: "UTC" });
const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
});

const dates = sampleDates.map((date) => {
  const value = new Date(`${date}T12:00:00Z`);
  return { day: dayFormatter.format(value), date: dateFormatter.format(value) };
});
const times = ["09:30", "10:15", "11:00", "12:30", "14:00", "15:45"].map((time) =>
  timeFormatter.format(new Date(`2026-09-01T${time}:00Z`)),
);

export function BookingDemo() {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("Mon");
  const [selectedTime, setSelectedTime] = useState("10:15 AM");
  const [dogName, setDogName] = useState("");

  return (
    <section className="booking-card" aria-labelledby="booking-title">
      <div
        className="booking-progress"
        role="progressbar"
        aria-label="Booking demo progress"
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
          <p className="booking-helper">Sample availability for demonstration only.</p>
          <fieldset>
            <legend>Select a day</legend>
            <div className="date-options">
              {dates.map((item) => (
                <button
                  type="button"
                  key={item.day}
                  className={selectedDate === item.day ? "selected" : ""}
                  onClick={() => setSelectedDate(item.day)}
                  aria-pressed={selectedDate === item.day}
                >
                  <span>{item.day}</span><strong>{item.date}</strong>
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Select a time</legend>
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
          </fieldset>
          <button type="button" className="button button-primary booking-next" onClick={() => setStep(2)}>
            Continue to dog details <ArrowIcon />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="booking-step">
          <p className="step-label">Step 2 of 3</p>
          <h2 id="booking-title">Who’s getting fresh?</h2>
          <p className="booking-helper">This name stays only in your browser and disappears on refresh.</p>
          <label className="field-label" htmlFor="dog-name">Dog’s first name <span>optional</span></label>
          <input
            id="dog-name"
            name="dog-name"
            type="text"
            value={dogName}
            onChange={(event) => setDogName(event.target.value)}
            placeholder="e.g. Mochi…"
            maxLength={30}
            autoComplete="off"
          />
          <div className="service-choice">
            <span className="service-check"><CheckIcon /></span>
            <div><strong>Self-serve wash</strong><small>Wash products, towels, dryer + cleanup</small></div>
            <span className="service-price">TBD</span>
          </div>
          <div className="booking-button-row">
            <button type="button" className="button button-ghost" onClick={() => setStep(1)}>Back</button>
            <button type="button" className="button button-primary" onClick={() => setStep(3)}>
              Review <ArrowIcon />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="booking-step booking-review">
          <p className="step-label">Step 3 of 3</p>
          <h2 id="booking-title">Looks fresh.</h2>
          <div className="review-dog" aria-hidden="true">🐾</div>
          <dl>
            <div><dt>Guest</dt><dd>{dogName.trim() || "Your pup"}</dd></div>
            <div><dt>Visit</dt><dd>{selectedDate}, {selectedTime}</dd></div>
            <div><dt>Service</dt><dd>Self-serve wash</dd></div>
            <div><dt>Payment</dt><dd>Connected after approval</dd></div>
          </dl>
          <div className="demo-notice">
            <strong>Demo complete</strong>
            <span>Nothing was reserved, saved, or charged.</span>
          </div>
          <div className="booking-button-row">
            <button type="button" className="button button-ghost" onClick={() => setStep(2)}>Back</button>
            <Link href="/" className="button button-primary">Return home <ArrowIcon /></Link>
          </div>
        </div>
      )}
    </section>
  );
}
