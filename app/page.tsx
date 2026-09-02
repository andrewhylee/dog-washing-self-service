import Image from "next/image";
import { DogWashIllustration } from "@/components/dog-wash-illustration";
import { SiteHeader } from "@/components/site-header";
import {
  ArrowIcon,
  CheckIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
} from "@/components/icons";
import { faqs, googlePhotos, googleReviews, included, site, washSteps } from "@/lib/site";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="hero">
          <div className="shell hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">
                <span className="eyebrow-dot" /> Sunnyside’s neighborhood wash
              </p>
              <h1>
                Fresh paws.
                <span>Happy hallway.</span>
              </h1>
              <p className="hero-lede">
                A proper dog wash without the bathtub crouch, soaked towels, or bathroom cleanup.
                You bring the pup—we’ll set the stage.
              </p>
              <div className="hero-actions">
                <a href={site.directionsHref} target="_blank" rel="noreferrer" className="button button-primary">
                  Get directions <ArrowIcon />
                </a>
                <a className="text-link" href={site.phoneHref}>
                  <PhoneIcon /> {site.phoneDisplay}
                </a>
              </div>
              <p className="hero-note">Open Mon–Fri 8am–7pm · Sat–Sun 9:30am–7pm · Walk-ins welcome</p>
            </div>
            <DogWashIllustration />
          </div>
          <section className="shell quick-facts" aria-label="Fresh Paws highlights">
            <div>
              <span className="fact-icon">01</span>
              <p><strong>Everything included</strong><small>From shampoo to dryer</small></p>
            </div>
            <div>
              <span className="fact-icon">02</span>
              <p><strong>Comfortable setup</strong><small>Save your back and bathroom</small></p>
            </div>
            <div>
              <span className="fact-icon">03</span>
              <p><strong>Right in Sunnyside</strong><small>44th Street, near Queens Blvd</small></p>
            </div>
          </section>
        </section>

        <section className="wash-story section" id="how-it-works">
          <div className="shell">
            <div className="section-heading split-heading">
              <div>
                <p className="eyebrow eyebrow-dark">The clean routine</p>
                <h2>Wash day, minus the ordeal.</h2>
              </div>
              <p>
                Three honest steps. No wrestling with your home tub, improvising with old towels,
                or cleaning the room after you clean the dog.
              </p>
            </div>
            <div className="wash-steps">
              <div className="bubble-route" aria-hidden="true">
                <span /><span /><span />
              </div>
              {washSteps.map((step) => (
                <article className="wash-step" key={step.number}>
                  <span className="step-number">{step.number}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="included-section section" id="included">
          <div className="shell included-grid">
            <div className="included-card">
              <div className="included-sticker" aria-hidden="true">ALL<br />IN</div>
              <p className="eyebrow">Travel light</p>
              <h2>Just bring the dog.</h2>
              <p className="section-copy">
                Everything you need for a full wash is provided on site — step right in and get
                started, with no supplies to bring along and no cleanup to handle.
              </p>
              <ul className="check-list">
                {included.map((item) => (
                  <li key={item}><CheckIcon /> {item}</li>
                ))}
              </ul>
            </div>
            <div className="tile-panel" aria-hidden="true">
              <span className="tile-label">THE<br />GOOD<br />CLEAN</span>
              <div className="tile-dog">
                <span className="tile-ear left" />
                <span className="tile-ear right" />
                <span className="tile-head"><i /><i /><b /></span>
              </div>
              <span className="tile-bubble tile-bubble-a" />
              <span className="tile-bubble tile-bubble-b" />
              <span className="tile-bubble tile-bubble-c" />
            </div>
          </div>
        </section>

        <section className="proof-section section" id="reviews">
          <div className="shell">
            <div className="proof-heading">
              <div>
                <p className="eyebrow eyebrow-dark">Fresh from Google</p>
                <h2>Loved by the neighborhood.</h2>
              </div>
              <a
                className="google-score"
                href={site.googleListingHref}
                target="_blank"
                rel="noreferrer"
                aria-label="View Fresh Paws’ 5.0 rating and 7 reviews on Google Maps"
              >
                <strong>5.0</strong>
                <span>
                  <span className="score-stars" aria-hidden="true">★★★★★</span>
                  <span>7 Google reviews</span>
                  <small>Checked August 31, 2026</small>
                </span>
              </a>
            </div>

            <div className="proof-showcase">
              <div className="listing-gallery">
                {googlePhotos.map((photo, index) => (
                  <figure className={`listing-photo listing-photo-${index + 1}`} key={photo.src}>
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      loading="lazy"
                      sizes={index === 0 ? "(max-width: 699px) 100vw, 40vw" : "(max-width: 699px) 50vw, 24vw"}
                    />
                    <figcaption>{index === 0 ? "Fresh Paws on 44th Street" : "Inside the wash"}</figcaption>
                  </figure>
                ))}
              </div>

              <div className="review-stack">
                {googleReviews.map((review, index) => (
                  <article className="review-card" key={review.author}>
                    <div className="review-card-top">
                      <span className="review-stars" role="img" aria-label="5 out of 5 stars">★★★★★</span>
                      <span className="review-number" aria-hidden="true">0{index + 1}</span>
                    </div>
                    <blockquote>“{review.quote}”</blockquote>
                    <p>{review.author}<span>Google reviewer</span></p>
                  </article>
                ))}
                <a className="text-link text-link-dark reviews-link" href={site.googleListingHref} target="_blank" rel="noreferrer">
                  Read all reviews on Google <ArrowIcon />
                </a>
              </div>
            </div>

            <p className="proof-source">
              Review excerpts and listing photos via{" "}
              <a href={site.googleListingHref} target="_blank" rel="noreferrer">Google Maps</a>.
            </p>
          </div>
        </section>

        <section className="pricing-section section" id="pricing">
          <div className="shell pricing-grid">
            <div className="pricing-copy">
              <p className="eyebrow eyebrow-dark">Simple by design</p>
              <h2>No mystery add-ons.</h2>
              <p>
                One clear wash price, with the essentials included. What you see is what you pay.
              </p>
              <a href={site.phoneHref} className="text-link text-link-dark">
                <PhoneIcon /> Call for current pricing
              </a>
            </div>
            <article className="price-card">
              <span className="price-kicker">Self-serve wash</span>
              <h3>One tub.<br />One fresh start.</h3>
              <p className="price-placeholder">$25 · Self-serve wash</p>
              <ul>
                <li><CheckIcon /> Wash products</li>
                <li><CheckIcon /> Towels and apron</li>
                <li><CheckIcon /> Professional dryer</li>
                <li><CheckIcon /> Cleanup handled</li>
              </ul>
              <a href={site.directionsHref} target="_blank" rel="noreferrer" className="button button-dark">
                Get directions <ArrowIcon />
              </a>
            </article>
          </div>
        </section>

        <section className="visit-section section" id="visit">
          <div className="shell visit-grid">
            <div className="visit-copy">
              <p className="eyebrow eyebrow-dark">Your neighborhood wash</p>
              <h2>Find us in Sunnyside.</h2>
              <p className="visit-address">{site.address}</p>
              <div className="visit-actions">
                <a href={site.directionsHref} target="_blank" rel="noreferrer" className="button button-primary">
                  <MapPinIcon /> Open in Maps
                </a>
                <a href={site.phoneHref} className="button button-outline">
                  <PhoneIcon /> {site.phoneDisplay}
                </a>
              </div>
              <div className="hours-note">
                <ClockIcon />
                <p><strong>Mon–Fri 8am–7pm · Sat–Sun 9:30am–7pm.</strong><span>Walk-ins welcome — first come, first serve. Last wash starts 30 minutes before close.</span></p>
              </div>
            </div>
            <a className="map-card" href={site.directionsHref} target="_blank" rel="noreferrer" aria-label="Open Fresh Paws in Google Maps">
              <span className="map-road road-a" />
              <span className="map-road road-b" />
              <span className="map-road road-c" />
              <span className="map-block block-a" />
              <span className="map-block block-b" />
              <span className="map-block block-c" />
              <span className="map-pin"><MapPinIcon /></span>
              <span className="map-caption"><strong>Fresh Paws</strong><small>44th St · Sunnyside</small></span>
            </a>
          </div>
        </section>

        <section className="faq-section section" id="faq">
          <div className="shell faq-grid">
            <div className="section-heading">
              <p className="eyebrow">Before the first splash</p>
              <h2>Good questions.<br />Clean answers.</h2>
            </div>
            <div className="faq-list">
              {faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}<span aria-hidden="true">+</span></summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="final-cta">
          <div className="shell final-cta-inner">
            <p>Ready when they roll in something questionable.</p>
            <div>
              <h2>Fresh starts here.</h2>
              <a href={site.directionsHref} target="_blank" rel="noreferrer" className="button button-light">
                Get directions <ArrowIcon />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <div><strong>{site.name}</strong><span>Self-serve dog wash · Sunnyside, Queens</span></div>
          <div><a href={site.phoneHref}>{site.phoneDisplay}</a><span>{site.address}</span></div>
        </div>
      </footer>

      <nav className="mobile-sticky" aria-label="Mobile actions">
        <a href={site.directionsHref} target="_blank" rel="noreferrer"><MapPinIcon /> Directions</a>
        <a href={site.phoneHref}><PhoneIcon /> Call</a>
      </nav>
    </>
  );
}
