import Image from "next/image";

export const metadata = {
  title: "Leave Us a Google Review | Fresh Paws Dog Wash",
  description:
    "Had a great wash at Fresh Paws Dog Wash? Scan the code to leave us a Google review — it takes about a minute.",
};

export default function GoogleReviewPage() {
  return (
    <main className="qr-kiosk" id="main-content" tabIndex={-1}>
      <p className="qr-kiosk-brand">Fresh Paws · self serve</p>
      <h1>Love your wash?</h1>
      <div className="qr-kiosk-code">
        <Image
          src="/images/google-review-qr.png"
          alt="QR code linking to the Fresh Paws Dog Wash Google review page"
          width={1000}
          height={1000}
          priority
        />
      </div>
      <p className="qr-kiosk-hint">Point your camera at the code<br />to review us on Google</p>
      <p className="qr-kiosk-stars" aria-hidden="true">★★★★★</p>
    </main>
  );
}
