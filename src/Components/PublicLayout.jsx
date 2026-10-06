import React from "react";
import { Link, NavLink } from "react-router-dom";
import Icon from "./Icon";
import "./PublicLayout.css";

const SITE_LINKS = [
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/why-us", label: "Why us" },
  { to: "/contact", label: "Contact" },
];

// Header and footer shared by the public information pages
function PublicLayout({ children }) {
  return (
    <div className="pub">
      <header className="pub-nav">
        <Link to="/dashboard" className="pub-brand">
          <span className="brand-mark"><Icon name="logo" size={16} /></span>
          Cherish
        </Link>
        <nav className="pub-links" aria-label="Site">
          {SITE_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? "active" : "")}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="pub-cta">
          <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
          <Link to="/signup" className="btn btn-primary btn-sm">Join free</Link>
        </div>
      </header>

      <main className="pub-main">{children}</main>

      <footer className="pub-footer">
        <div className="pub-footer-inner">
          <div>
            <Link to="/dashboard" className="pub-brand">
              <span className="brand-mark"><Icon name="logo" size={16} /></span>
              Cherish
            </Link>
            <p>Hobby-first dating for people who want more than a swipe.</p>
          </div>
          <div className="pub-footer-links">
            {SITE_LINKS.map((l) => <Link key={l.to} to={l.to}>{l.label}</Link>)}
            <Link to="/signup">Join free</Link>
          </div>
        </div>
        <small>© {new Date().getFullYear()} Cherish. All rights reserved.</small>
      </footer>
    </div>
  );
}

// Page hero used at the top of each public page
export function PageHero({ eyebrow, title, subtitle, children }) {
  return (
    <section className="pub-hero">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {subtitle && <p className="pub-hero-sub">{subtitle}</p>}
      {children}
    </section>
  );
}

// Content block with an optional eyebrow, heading and intro
export function Section({ id, eyebrow, title, intro, alt = false, children }) {
  return (
    <section id={id} className={`pub-section ${alt ? "alt" : ""}`}>
      <div className="pub-container">
        {(eyebrow || title) && (
          <header className="pub-section-head">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2>{title}</h2>}
            {intro && <p className="pub-intro">{intro}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

export default PublicLayout;
