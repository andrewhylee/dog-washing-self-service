"use client";

import Link from "next/link";
import { useRef } from "react";
import { BrandMark } from "@/components/brand";
import { ArrowIcon } from "@/components/icons";

const links = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#included", label: "What’s included" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#visit", label: "Visit" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteHeader() {
  const menuRef = useRef<HTMLDetailsElement>(null);
  const closeMenu = () => menuRef.current?.removeAttribute("open");

  return (
    <>
      <aside className="concept-bar" aria-label="Concept website notice">
        <span>Concept website</span>
        <span className="concept-detail">Reservations and pricing are demo-only</span>
      </aside>
      <header className="site-header">
        <div className="shell header-inner">
          <Link href="/" className="brand-link">
            <BrandMark />
          </Link>
          <nav className="desktop-nav" aria-label="Primary navigation">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <Link href="/book" className="button button-small header-cta">
            Explore booking <ArrowIcon />
          </Link>
          <details className="mobile-menu" ref={menuRef}>
            <summary aria-label="Navigation menu">
              <span />
              <span />
            </summary>
            <nav aria-label="Mobile navigation">
              {links.map((link) => (
                <Link key={link.href} href={link.href} onClick={closeMenu}>
                  {link.label}
                </Link>
              ))}
              <Link href="/book" onClick={closeMenu}>Explore booking demo</Link>
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}
