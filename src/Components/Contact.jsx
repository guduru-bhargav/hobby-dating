import React, { useState } from "react";
import "./Contact.css";
import PublicLayout, { PageHero, Section } from "./PublicLayout";
import Icon from "./Icon";
import { supabase } from "../lib/supabase";
import { errorMessage } from "../lib/utils";

const DETAILS = [
  { icon: "mail", label: "Email", value: "support@cherish.com", href: "mailto:support@cherish.com" },
  { icon: "phone", label: "Phone", value: "+91 7000-7001-00", href: "tel:+917000700100" },
  { icon: "clock", label: "Hours", value: "Mon – Fri, 9 AM – 6 PM IST" },
  { icon: "pin", label: "Based in", value: "Bangalore, India" },
];

const FAQS = [
  {
    q: "How do I report a profile?",
    a: "Email us with the profile's first name, the city, and what happened. Include any screenshots that help.",
  },
  {
    q: "Is my data safe?",
    a: "Your data is stored with Supabase and sent over encrypted connections. Only the profile you publish is visible to other members.",
  },
  {
    q: "How do I delete my account?",
    a: "Go to Settings and select Request deletion. That opens an email to us, and we'll remove your profile, photos and messages.",
  },
  {
    q: "Are there any fees?",
    a: "Cherish is free to join and use.",
  },
  {
    q: "Can I change my hobbies?",
    a: "Yes. Open My profile, select Edit profile, and update your hobbies. Changes show up straight away.",
  },
  {
    q: "How does Discover choose people?",
    a: "You see members who match your 'Interested in' preference and who are interested in you. You can narrow the list by age, city, gender and hobbies.",
  },
];

const EMPTY = { name: "", email: "", subject: "", message: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const update = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSent(false);

    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (!EMAIL_RE.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setBusy(true);
    const { error: dbError } = await supabase.from("contact_messages").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    });
    setBusy(false);

    // Only report success when the message was actually stored
    if (dbError) {
      setError(`We couldn't send your message. Please email support@cherish.com instead. (${errorMessage(dbError)})`);
      return;
    }
    setForm(EMPTY);
    setSent(true);
  };

  return (
    <PublicLayout>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        subtitle="Questions, feedback or a safety concern? We'd love to hear from you."
      />

      <Section>
        <div className="contact-layout">
          <aside className="contact-info">
            <h2>Contact Cherish</h2>
            <p>Reach out for questions, feedback or support.</p>
            <ul className="contact-details">
              {DETAILS.map((d) => (
                <li key={d.label}>
                  <span className="pub-icon"><Icon name={d.icon} size={20} /></span>
                  <div>
                    <small>{d.label}</small>
                    {d.href ? <a href={d.href}>{d.value}</a> : <strong>{d.value}</strong>}
                  </div>
                </li>
              ))}
            </ul>
          </aside>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <h3>Send us a message</h3>

            <div className="contact-grid">
              <div className="field">
                <label htmlFor="ct-name">Full name</label>
                <input id="ct-name" className="input" name="name" value={form.name} onChange={update} />
              </div>
              <div className="field">
                <label htmlFor="ct-email">Email</label>
                <input id="ct-email" className="input" type="email" name="email" value={form.email} onChange={update} />
              </div>
            </div>

            <div className="field">
              <label htmlFor="ct-subject">Subject</label>
              <input id="ct-subject" className="input" name="subject" value={form.subject} onChange={update}
                placeholder="e.g. Feedback, Safety, Account help" />
            </div>

            <div className="field">
              <label htmlFor="ct-message">Message</label>
              <textarea id="ct-message" className="input" name="message" rows={6} value={form.message} onChange={update}
                placeholder="Tell us what's on your mind" />
            </div>

            {error && <div className="form-error" role="alert">{error}</div>}
            {sent && <div className="form-success" role="status">Thanks! Your message is on its way. We'll reply by email.</div>}

            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? "Sending…" : "Send message"}
            </button>
          </form>
        </div>
      </Section>

      <Section alt eyebrow="FAQ" title="Frequently asked questions">
        <div className="faq-list">
          {FAQS.map((f) => (
            <details key={f.q} className="faq-item">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </PublicLayout>
  );
}

export default Contact;
