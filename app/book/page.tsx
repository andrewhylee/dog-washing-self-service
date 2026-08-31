import Link from "next/link";
import { BookingDemo } from "@/components/booking-demo";
import { BrandMark } from "@/components/brand";

export const metadata = {
  title: "Booking Demo | Fresh Paws Dog Wash",
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
          <p className="eyebrow">Future feature preview</p>
          <h1>Pick a wash time.<br />Skip the guesswork.</h1>
          <p>
            This interactive concept shows how a simple reservation could feel. It does not save
            information, reserve a tub, or process payment.
          </p>
          <div className="booking-trust">
            <span>✓ No account needed for this demo</span>
            <span>✓ No personal data is submitted</span>
            <span>✓ No payment is collected</span>
          </div>
        </section>
        <BookingDemo />
      </div>
    </main>
  );
}
