import React from "react";
import { Link } from "react-router-dom";
import "./WhyUs.css";
import PublicLayout, { PageHero, Section } from "./PublicLayout";
import Icon from "./Icon";

const BENEFITS = [
  { icon: "heart", title: "Hobby-first profiles", text: "Your interests are on show from the start, so you connect over things you both care about." },
  { icon: "shield", title: "Verified sign-up", text: "Every account confirms its email address before it can be used." },
  { icon: "pin", title: "Six Indian cities", text: "Mumbai, Delhi, Bangalore, Hyderabad, Chennai and Pune, with a city filter on Discover." },
  { icon: "chat", title: "Live one-to-one chat", text: "Messages arrive instantly, and matches can talk right away." },
  { icon: "lock", title: "Only your profile is public", text: "Your login details and private messages are never shown to other members." },
  { icon: "sparkle", title: "Free to join", text: "Create a profile, discover people and chat without paying anything." },
];

const INCLUDED = [
  "Create a profile with two photos and your hobbies",
  "Discover deck with like, pass and message actions",
  "Filters by age, city, gender and hobbies",
  "Matches when you both like each other",
  "One-to-one chat with unread badges",
  "Profile editor with a completeness meter",
  "Password change and email-based account deletion",
];

const TIPS = [
  { title: "Fill in your hobbies", text: "Specific hobbies (\"trail running\", \"film photography\") lead to better conversations than generic ones." },
  { title: "Use two clear photos", text: "One face photo and one that shows what you enjoy works well. Members see both on your card." },
  { title: "Start with the hobby", text: "Mention something you both like in your first message. It's an easy way to get talking." },
  { title: "Keep your profile fresh", text: "Update your details as your interests change. A complete profile shows up more in searches." },
];

function WhyUs() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Why Cherish"
        title="The hobby-first dating app for meaningful connections"
        subtitle="We focus on shared passions, genuine interests and real compatibility."
      />

      <Section eyebrow="The difference" title="Why Hobby Dating?" intro="Many dating apps focus on appearance. We start with what you enjoy doing.">
        <div className="pub-grid">
          {BENEFITS.map((b) => (
            <article key={b.title} className="pub-card">
              <span className="pub-icon"><Icon name={b.icon} size={22} /></span>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section alt eyebrow="Included" title="What you get, free">
        <ul className="why-included">
          {INCLUDED.map((item) => (
            <li key={item}>
              <span className="why-check"><Icon name="check" size={16} strokeWidth={3} /></span>
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="Getting started" title="Tips for better matches">
        <div className="pub-grid">
          {TIPS.map((t, i) => (
            <article key={t.title} className="pub-card">
              <span className="why-tip-n">{i + 1}</span>
              <h3>{t.title}</h3>
              <p>{t.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <section className="pub-cta-band">
        <h2>Find your hobby match today</h2>
        <p>Join in a few minutes and start discovering people who share your interests.</p>
        <div className="hero-actions">
          <Link to="/signup" className="btn btn-light btn-lg">Get started</Link>
          <Link to="/services" className="btn btn-ghost btn-lg">Explore services</Link>
        </div>
      </section>
    </PublicLayout>
  );
}

export default WhyUs;
