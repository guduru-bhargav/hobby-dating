import React from "react";
import "./Services.css";

function Services() {
  const services = [
    {
      icon: "🎯",
      title: "Hobby-Based Matching",
      description:
        "Find matches who share your passions. Our smart algorithm connects you with people who love the same hobbies—photography, travel, music, sports, and more.",
    },
    {
      icon: "💬",
      title: "Real-Time Chat",
      description:
        "Connect instantly with your matches. Our secure, real-time messaging lets you get to know someone before meeting in person.",
    },
    {
      icon: "🔍",
      title: "Advanced Filters",
      description:
        "Customize your search by age, location, gender preference, hobbies, and dating intent. Find exactly who you're looking for.",
    },
    {
      icon: "✅",
      title: "Profile Verification",
      description:
        "Build trust in our community. Get verified with a badge and see which members are verified—safety is our priority.",
    },
    {
      icon: "📸",
      title: "Photo Upload & Gallery",
      description:
        "Showcase your best self with up to 2+ profile photos. Use high-quality images to make a great first impression.",
    },
    {
      icon: "📍",
      title: "Location-Based Discovery",
      description:
        "Find people near you by filtering within 5-100 km. Distance filter helps you discover local matches easily.",
    },
    {
      icon: "🏆",
      title: "Hobby Communities",
      description:
        "Join hobby-specific groups, discover trending interests in your area, and connect with like-minded people.",
    },
    {
      icon: "🛡️",
      title: "Safety & Privacy Controls",
      description:
        "Report and block unwanted users. Full control over who sees your profile and your personal information.",
    },
    {
      icon: "⚡",
      title: "Instant Notifications",
      description:
        "Get real-time alerts when someone likes you, messages you, or your hobby match is online. Never miss a connection.",
    },
    {
      icon: "🌍",
      title: "Multi-City Support",
      description:
        "Available in all major Indian cities—Mumbai, Delhi, Bangalore, Hyderabad, Pune, Chennai, and growing every day.",
    },
    {
      icon: "📊",
      title: "Smart Recommendations",
      description:
        "AI-powered suggestions based on your profile and preferences. Discover matches you'll actually connect with.",
    },
    {
      icon: "🎁",
      title: "Success Stories",
      description:
        "Read real stories of people who found love through shared hobbies. Your story could be next!",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Create Your Profile",
      description: "Sign up with email and set up your profile with your hobbies and interests.",
    },
    {
      number: "2",
      title: "Upload Photos",
      description: "Add 2+ photos to showcase your personality and increase match quality.",
    },
    {
      number: "3",
      title: "Get Matched",
      description: "Browse and discover matches based on shared hobbies and preferences.",
    },
    {
      number: "4",
      title: "Connect & Chat",
      description: "Message your matches and get to know them better before meeting.",
    },
    {
      number: "5",
      title: "Meet & Fall in Love",
      description: "Plan dates around your shared hobbies and build meaningful relationships.",
    },
  ];

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="services-hero">
        <div className="hero-content">
          <h1>Our Services</h1>
          <p className="hero-subtitle">
            Everything you need to find love through shared hobbies
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="intro-section">
        <div className="container">
          <h2>Why Choose Hobby Dating?</h2>
          <p className="intro-text">
            Unlike traditional dating apps that focus on swiping and location, Hobby Dating puts 
            your passions first. We believe lasting relationships are built on shared interests, 
            mutual hobbies, and genuine compatibility. Our platform is designed to help you find 
            someone who doesn't just look right—but shares what you love.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-section">
        <div className="container">
          <h2>What We Offer</h2>
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps-container">
            {steps.map((step, index) => (
              <div key={index} className="step">
                <div className="step-number">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                {index < steps.length - 1 && <div className="step-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Trust Section */}
      <section className="safety-section">
        <div className="container">
          <h2>Your Safety is Our Priority</h2>
          <div className="safety-features">
            <div className="safety-item">
              <h3>✔️ Verified Profiles</h3>
              <p>All users go through email verification to ensure authenticity.</p>
            </div>
            <div className="safety-item">
              <h3>🔐 Data Privacy</h3>
              <p>Your information is encrypted and never shared with third parties.</p>
            </div>
            <div className="safety-item">
              <h3>⚠️ Report & Block</h3>
              <p>Flag inappropriate behavior and block users instantly.</p>
            </div>
            <div className="safety-item">
              <h3>💬 Safe Messaging</h3>
              <p>Chat with peace of mind on our secure platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="metrics-section">
        <div className="container">
          <h2>By The Numbers</h2>
          <div className="metrics-grid">
            <div className="metric">
              <div className="metric-number">50K+</div>
              <div className="metric-label">Active Users</div>
            </div>
            <div className="metric">
              <div className="metric-number">100+</div>
              <div className="metric-label">Hobbies Categories</div>
            </div>
            <div className="metric">
              <div className="metric-number">10K+</div>
              <div className="metric-label">Successful Connections</div>
            </div>
            <div className="metric">
              <div className="metric-number">15</div>
              <div className="metric-label">Indian Cities</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Find Your Perfect Match?</h2>
          <p>Join thousands of people discovering love through shared passions.</p>
          <div className="cta-buttons">
            <button className="btn btn-primary">Sign Up Free</button>
            <button className="btn btn-secondary">Learn More About Us</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Services;
