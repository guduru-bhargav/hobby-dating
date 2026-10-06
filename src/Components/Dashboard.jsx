import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Icon from "./Icon";
import { supabase } from "../lib/supabase";

const FEATURES = [
  { icon: "heart", title: "Match on interests", text: "Hobbies and what you're looking for come first, so every match has something to talk about." },
  { icon: "shield", title: "Safety first", text: "Every account confirms its email address, and only the profile you publish is visible to others." },
  { icon: "chat", title: "Real conversations", text: "Private one-to-one chat that updates live, with no waiting for a reply to load." },
  { icon: "filter", title: "Filters that work", text: "Narrow by age, city, hobbies and more. Pass on anyone who isn't right for you." },
];

const STEPS = [
  { n: "01", title: "Create your profile", text: "Add two photos, a few hobbies and what you're looking for." },
  { n: "02", title: "Discover people", text: "Like or pass on people whose interests overlap with yours." },
  { n: "03", title: "Start a conversation", text: "When you match, say hi. It's a one-to-one chat from the first message." },
];

// Decorative sample cards. These are stock photos, not members.
const SAMPLE_CARDS = [
  { img: "https://randomuser.me/api/portraits/women/44.jpg", name: "Sample", meta: "Photography · Travel", pos: "front" },
  { img: "https://randomuser.me/api/portraits/men/45.jpg", name: "Sample", meta: "Music · Hiking", pos: "back" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  // Logged-in visitors skip the landing page
  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      if (data?.session?.user) navigate("/MainPage", { replace: true });
      else setChecking(false);
    });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (checking) {
    return (
      <div className="landing-loading">
        <div className="spinner" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="landing">
      <header className="landing-nav">
        <Link to="/dashboard" className="landing-brand">
          <span className="brand-mark"><Icon name="logo" size={16} /></span>
          Cherish
        </Link>
        <nav className="landing-links" aria-label="Site">
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/why-us">Why us</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <div className="landing-cta">
          <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
          <Link to="/signup" className="btn btn-primary btn-sm">Join free</Link>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Hobby dating, reimagined</p>
          <h1>
            Love what you <span className="grad">do together.</span>
          </h1>
          <p className="hero-sub">
            Cherish connects people through shared hobbies and interests, so every
            conversation starts with something real.
          </p>
          <div className="hero-actions">
            <button type="button" className="btn btn-primary btn-lg" onClick={() => navigate("/signup")}>
              Get started <Icon name="arrowRight" size={18} />
            </button>
            <Link to="/login" className="btn btn-ghost btn-lg">I have an account</Link>
          </div>
          <ul className="hero-trust">
            <li><Icon name="shield" size={16} /> Email-verified accounts</li>
            <li><Icon name="heart" size={16} /> Free to join</li>
          </ul>
        </div>

        <div className="hero-visual" aria-hidden="true">
          {SAMPLE_CARDS.map((card) => (
            <figure key={card.pos} className={`hero-card ${card.pos}`}>
              <img src={card.img} alt="" />
              <figcaption>
                <strong>{card.name}</strong>
                <span>{card.meta}</span>
              </figcaption>
            </figure>
          ))}
          <div className="hero-badge">
            <Icon name="heart" size={16} strokeWidth={0} /> It's a match
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <p className="eyebrow">Why Cherish</p>
          <h2>Built around what you enjoy</h2>
        </div>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <article key={f.title} className="feature-card">
              <div className="feature-icon"><Icon name={f.icon} size={22} /></div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <div className="section-head">
          <p className="eyebrow">How it works</p>
          <h2>Three steps to your first conversation</h2>
        </div>
        <ol className="steps">
          {STEPS.map((s) => (
            <li key={s.n} className="step">
              <span className="step-n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="cta-band">
        <h2>Your next great conversation starts with a shared hobby.</h2>
        <button type="button" className="btn btn-light btn-lg" onClick={() => navigate("/signup")}>
          Create your profile
        </button>
      </section>

      <footer className="landing-footer">
        <div className="landing-brand">
          <span className="brand-mark"><Icon name="logo" size={16} /></span>
          Cherish
        </div>
        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/why-us">Why us</Link>
          <Link to="/contact">Contact</Link>
          <a href="mailto:info@hda.com">info@hda.com</a>
        </div>
        <small>© {new Date().getFullYear()} Cherish. All rights reserved.</small>
      </footer>
    </div>
  );
}
