import React from "react";
import { Link } from "react-router-dom";
import "./Services.css";
import PublicLayout, { PageHero, Section } from "./PublicLayout";
import Icon from "./Icon";

// Only features the app actually has today
const FEATURES = [
  { icon: "heart", title: "Hobby-first profiles", text: "Your hobbies are front and centre on your profile, so people see what you love before anything else." },
  { icon: "discover", title: "Discover & match", text: "Like or pass on people one at a time. When you both like each other, you get a match and can start chatting." },
  { icon: "chat", title: "One-to-one chat", text: "Message your matches in a private conversation that updates live, with unread badges so you never miss a reply." },
  { icon: "filter", title: "Smart filters", text: "Narrow your deck by age, city, gender and hobbies. Your 'Interested in' preference is always applied." },
  { icon: "camera", title: "Two photos per profile", text: "Show more of yourself. Members swipe between your two photos on your card." },
  { icon: "users", title: "Profile editor", text: "Update your details, photos and hobbies at any time. A completeness meter shows what's left to add." },
  { icon: "shield", title: "Verified sign-up", text: "Every account confirms its email address with a one-time code before it can be used." },
  { icon: "settings", title: "Account controls", text: "Change your password any time, and request account deletion by email." },
];

const STEPS = [
  { n: "1", title: "Create your profile", text: "Sign up with your email, add your details and pick your hobbies." },
  { n: "2", title: "Add two photos", text: "Clear photos help people get to know you before they say hi." },
  { n: "3", title: "Discover people", text: "Browse your deck and like or pass. Use filters to focus your search." },
  { n: "4", title: "Chat when you match", text: "A mutual like opens the door. Start a one-to-one conversation right away." },
  { n: "5", title: "Meet up", text: "Plan a date around something you both enjoy." },
];

const SAFETY = [
  { icon: "mail", title: "Verified sign-up", text: "Each account confirms its email address with a one-time code." },
  { icon: "lock", title: "Private by design", text: "Only the profile you publish is visible to other members. Your login details are never shown." },
  { icon: "shield", title: "Report a profile", text: "Email us with the profile name and what happened, and we'll look into it." },
  { icon: "chat", title: "Private messages", text: "Conversations are between two members. Nobody else can read them." },
];

function Services() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Our services"
        title="Everything you need to find love through shared hobbies"
        subtitle="Discover people who enjoy what you enjoy, then talk about it."
      />

      <Section eyebrow="What we offer" title="Built around the way you connect">
        <div className="pub-grid">
          {FEATURES.map((f) => (
            <article key={f.title} className="pub-card">
              <span className="pub-icon"><Icon name={f.icon} size={22} /></span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section alt eyebrow="How it works" title="From sign-up to first date">
        <ol className="svc-steps">
          {STEPS.map((s) => (
            <li key={s.n} className="svc-step">
              <span className="svc-step-n">{s.n}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="Safety" title="Your safety comes first">
        <div className="pub-grid">
          {SAFETY.map((s) => (
            <article key={s.title} className="pub-card">
              <span className="pub-icon"><Icon name={s.icon} size={22} /></span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <section className="pub-cta-band">
        <h2>Ready to find your perfect match?</h2>
        <p>Create a free profile in a few minutes.</p>
        <div className="hero-actions">
          <Link to="/signup" className="btn btn-light btn-lg">Sign up free</Link>
          <Link to="/why-us" className="btn btn-ghost btn-lg">Why Cherish</Link>
        </div>
      </section>
    </PublicLayout>
  );
}

export default Services;
