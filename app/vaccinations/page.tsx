import Link from "next/link";
import { BrandMark } from "@/components/brand";
import { VaccineForm } from "@/components/vaccine-form";

export const metadata = {
  title: "Share Vaccination Records | Fresh Paws Dog Wash",
};

export default function VaccinationsPage() {
  return (
    <main className="booking-page" id="main-content" tabIndex={-1}>
      <header className="booking-header shell">
        <Link href="/" className="brand-link"><BrandMark /></Link>
        <Link href="/" className="booking-close" aria-label="Return to homepage">×</Link>
      </header>
      <div className="shell booking-page-grid">
        <section className="booking-intro vaccine-intro">
          <p className="eyebrow">Good to know</p>
          <h1>Share your pup’s<br />vaccine card.</h1>
          <p>
            Send your dog’s vaccination record before you stop by and we’ll have
            everything ready when you walk in. No appointment needed — just
            upload and come on over.
          </p>
          <div className="booking-trust">
            <span>✓ Quick upload, no appointment needed</span>
            <span>✓ Photos or PDFs up to 2 MB</span>
            <span>✓ Your details stay private</span>
          </div>
        </section>
        <VaccineForm />
      </div>
    </main>
  );
}