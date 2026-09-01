import Link from "next/link";
import { BookingDemo } from "@/components/booking-demo";
import { BrandMark } from "@/components/brand";

export const metadata = {
  title: "Reserve a Wash | Fresh Paws Dog Wash",
};

export default function BookPage() {
  return (
    <main className="booking-page" id="main-content" tabIndex={-1}>
      <header className="booking-header shell">
        <Link href="/" className="brand-link"><BrandMark /></Link>
        <Link href="/" className="booking-close" aria-label="Return to homepage">×</Link>
      </header>
      <div className="shell booking-page-grid">
        <section className="booking-intro">
          <p className="eyebrow">Online reservations</p>
          <h1>Pick a wash time.<br />Skip the guesswork.</h1>
          <p>
            Reserve your tub online in just a few steps. Your details are stored securely and
            nothing is charged until you arrive.
          </p>
          <div className="booking-trust">
            <span>✓ Quick and easy booking</span>
            <span>✓ Your details stay private</span>
            <span>✓ Pay in store</span>
          </div>
        </section>
        <BookingDemo />
      </div>
    </main>
  );
}
