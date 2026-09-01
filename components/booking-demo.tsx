"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowIcon, CheckIcon } from "@/components/icons";

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
});

const times = ["09:30", "10:15", "11:00", "12:30", "14:00", "15:45"].map((time) =>
  timeFormatter.format(new Date(`2026-09-01T${time}:00Z`)),
);

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
  const [dogName, setDogName] = useState("");

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
            Continue to dog details <ArrowIcon />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="booking-step">
          <p className="step-label">Step 2 of 3</p>
          <h2 id="booking-title">Who’s getting fresh?</h2>
          <p className="booking-helper">{readableDate(selectedDate)}, {selectedTime}</p>
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
            <div><strong>Self-serve wash</strong><small>Wash products, towels, dryers, grooming tools + fragrance</small></div>
            <span className="service-price">$25</span>
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
            <div><dt>Visit</dt><dd>{readableDate(selectedDate)}, {selectedTime}</dd></div>
            <div><dt>Service</dt><dd>Self-serve wash</dd></div>
            <div><dt>Payment</dt><dd>Pay in store</dd></div>
          </dl>
          <div className="demo-notice">
            <strong>All set</strong>
            <span>We’ll hold your tub and see you then.</span>
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
