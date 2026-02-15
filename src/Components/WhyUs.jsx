import React from "react";
import "./WhyUs.css";

function WhyUs() {
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Mumbai",
      hobby: "Photography",
      content:
        "Finally found someone who shares my passion for photography! We've been exploring the city together capturing beautiful moments.",
      rating: 5,
    },
    {
      id: 2,
      name: "Arjun Patel",
      location: "Bangalore",
      hobby: "Hiking",
      content:
        "The hobby-based matching is incredible. Met my girlfriend on a hiking trip organized through the app. Best decision ever!",
      rating: 5,
    },
    {
      id: 3,
      name: "Anjali Desai",
      location: "Delhi",
      hobby: "Book Club",
      content:
        "Love how I can find people who actually read and discuss books. This app gets what matters - shared interests!",
      rating: 5,
    },
    {
      id: 4,
      name: "Rohan Kumar",
      location: "Pune",
      hobby: "Coding & Tech",
      content:
        "Met brilliant people through this platform. We not only date but collaborate on projects. Unique experience!",
      rating: 5,
    },
  ];

  const benefits = [
    {
      icon: "🎯",
      title: "Hobby-First Matching",
      description: "Find people who share your actual interests, not just your photos",
    },
    {
      icon: "💯",
      title: "Verified Members",
      description: "All members are verified to ensure authentic and safe connections",
    },
    {
      icon: "🌍",
      title: "15+ Indian Cities",
      description: "Connect with hobby enthusiasts across India with city filters",
    },
    {
      icon: "💬",
      title: "Real-Time Chat",
      description: "Message matches instantly and get to know them before meeting",
    },
    {
      icon: "🛡️",
      title: "Privacy First",
      description: "Your data is encrypted and never shared with third parties",
    },
    {
      icon: "🚀",
      title: "Smart Recommendations",
      description: "AI-powered matching based on hobbies, interests, and location",
    },
  ];

  return (
    <div className="why-us-page">
      {/* Hero Section */}
      <section className="why-us-hero">
        <h1>Why Choose Cherish?</h1>
        <p>The Hobby-First Dating App for Meaningful Connections</p>
      </section>

      {/* Why Hobby Dating Section */}
      <section className="why-section">
        <div className="why-container">
          <h2>Why Hobby Dating?</h2>
          <p className="section-intro">
            Traditional dating apps focus on appearance. We focus on what matters — shared passions, genuine interests, and real compatibility.
          </p>
          <div className="benefits-grid">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="benefit-card">
                <div className="benefit-icon">{benefit.icon}</div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="comparison-section">
        <div className="comparison-container">
          <h2>How We Compare</h2>
          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Features</th>
                  <th className="app-column">
                    <span className="app-name">Cherish</span>
                  </th>
                  <th className="other-column">
                    <span>Traditional Apps</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Hobby-Based Matching</td>
                  <td className="checkmark">✓</td>
                  <td className="cross">✗</td>
                </tr>
                <tr>
                  <td>Member Verification</td>
                  <td className="checkmark">✓</td>
                  <td className="cross">✗</td>
                </tr>
                <tr>
                  <td>City-Based Filtering</td>
                  <td className="checkmark">✓</td>
                  <td className="checkmark">✓</td>
                </tr>
                <tr>
                  <td>Real-Time Messaging</td>
                  <td className="checkmark">✓</td>
                  <td className="checkmark">✓</td>
                </tr>
                <tr>
                  <td>Privacy Protection</td>
                  <td className="checkmark">✓</td>
                  <td className="cross">✗</td>
                </tr>
                <tr>
                  <td>Photo Gallery</td>
                  <td className="checkmark">✓</td>
                  <td className="checkmark">✓</td>
                </tr>
                <tr>
                  <td>Smart Recommendations</td>
                  <td className="checkmark">✓</td>
                  <td className="cross">✗</td>
                </tr>
                <tr>
                  <td>Community Features</td>
                  <td className="checkmark">✓</td>
                  <td className="cross">✗</td>
                </tr>
                <tr>
                  <td>Safety & Blocking</td>
                  <td className="checkmark">✓</td>
                  <td className="checkmark">✓</td>
                </tr>
                <tr>
                  <td>Cost-Free</td>
                  <td className="checkmark">✓</td>
                  <td className="cross">✗ (Premium)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <h2>Success Stories</h2>
          <p className="section-intro">
            Real stories from real members who found meaningful connections
          </p>
          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="testimonial-info">
                    <h4>{testimonial.name}</h4>
                    <p className="hobby-tag">{testimonial.hobby}</p>
                  </div>
                </div>
                <div className="stars">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
                <p className="testimonial-content">"{testimonial.content}"</p>
                <p className="testimonial-location">📍 {testimonial.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="why-us-cta">
        <h2>Find Your Hobby Match Today</h2>
        <p>Join thousands of people finding love through shared passions</p>
        <div className="cta-buttons">
          <a href="/signup" className="btn btn-primary">
            Get Started
          </a>
          <a href="/services" className="btn btn-secondary">
            Learn More
          </a>
        </div>
      </section>
    </div>
  );
}

export default WhyUs;
