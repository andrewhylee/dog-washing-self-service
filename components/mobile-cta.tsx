"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPinIcon, UploadIcon } from "@/components/icons";
import { site } from "@/lib/site";

export function MobileStickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const heroActions = document.querySelector(".hero-actions");
    if (!heroActions) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 },
    );
    observer.observe(heroActions);
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className={`mobile-sticky${visible ? " is-visible" : ""}`}
      aria-label="Mobile actions"
      aria-hidden={!visible}
    >
      <Link href="/vaccinations" className="vaccine-link">
        <UploadIcon /> Vaccine card
      </Link>
      <a href={site.directionsHref} target="_blank" rel="noreferrer">
        <MapPinIcon /> Directions
      </a>
    </nav>
  );
}