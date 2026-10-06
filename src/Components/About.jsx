import React from "react";
import { Link } from "react-router-dom";
import "./About.css";
import PublicLayout, { PageHero, Section } from "./PublicLayout";
import Icon from "./Icon";

const VISION = [
  { icon: "globe", title: "Global community", text: "A community of people united by their passions, where geography is no barrier to finding your match." },
  { icon: "heart", title: "Meaningful connections", text: "Every profile tells a story. We help you find someone who enjoys your hobbies as much as you do." },
  { icon: "shield", title: "Trust & safety", text: "A platform built on transparency and respect, where every member feels secure and valued." },
];

const VALUES = [
  { emoji: "🎯", title: "Authenticity", text: "Be yourself. Share your true passions and interests." },
  { emoji: "🤝", title: "Inclusivity", text: "Everyone deserves love. We welcome all genders, orientations and hobbies." },
  { emoji: "🔐", title: "Privacy", text: "Your data is yours. We take user privacy and security seriously." },
  { emoji: "💡", title: "Innovation", text: "We keep improving the hobby-based matching experience." },
  { emoji: "😊", title: "Fun", text: "Dating should be fun. We celebrate the lighter side of finding love." },
  { emoji: "🌟", title: "Excellence", text: "We sweat the details so every member has a great experience." },
];

function About() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="About Cherish"
        title="Connecting people through what they love"
        subtitle="Hobby Dating helps people meet on shared interests and passions, not just a photo."
      />

      <Section eyebrow="Our mission" title="Start with what you enjoy">
        <div className="pub-prose">
          <p>
            Our mission is to change how people meet by putting shared interests and passions at the heart of
            every connection. Lasting relationships grow when two people share hobbies, values and goals, not just
            first impressions.
          </p>
          <p>
            We're building a safe, inclusive and fun place where you can be yourself, discover like-minded people
            and build relationships based on real compatibility.
          </p>
        </div>
      </Section>

      <Section alt eyebrow="Our vision" title="Where we're headed">
        <div className="pub-grid">
          {VISION.map((v) => (
            <article key={v.title} className="pub-card">
              <span className="pub-icon"><Icon name={v.icon} size={22} /></span>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section eyebrow="Founder's story" title="Why we built Cherish">
        <div className="about-founder">
          <div className="pub-prose">
            <p>
              Hobby Dating started from a simple observation: many dating apps focus on looks and location, and
              miss what matters most, which is shared passion.
            </p>
            <p>
              Our founder got tired of being matched with people they had nothing in common with. Passionate about
              photography, travel and music, they wanted a platform that connects people on interests first, and
              then explores attraction.
            </p>
            <p>
              That idea became Cherish. We're still early, and we're focused on getting the basics right: people
              who share your hobbies, conversations that start easily, and a community you can trust.
            </p>
          </div>
          <aside className="about-founder-card">
            <span className="about-avatar" aria-hidden="true">BG</span>
            <h3>Bhargav Guduru</h3>
            <p>Founder & CEO</p>
          </aside>
        </div>
      </Section>

      <Section alt eyebrow="What we stand for" title="Our core values">
        <div className="pub-grid">
          {VALUES.map((v) => (
            <article key={v.title} className="pub-card">
              <span className="about-emoji" aria-hidden="true">{v.emoji}</span>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <section className="pub-cta-band">
        <h2>Ready to find your match?</h2>
        <p>Create a free profile and start discovering people who share your interests.</p>
        <div className="hero-actions">
          <Link to="/signup" className="btn btn-light btn-lg">Sign up free</Link>
          <Link to="/services" className="btn btn-ghost btn-lg">See how it works</Link>
        </div>
      </section>
    </PublicLayout>
  );
}

export default About;
