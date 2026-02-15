import React from "react";
import "./About.css";

function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>About Hobby Dating</h1>
          <p className="hero-subtitle">
            Connecting passionate people through shared interests and hobbies
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <h2>Our Mission</h2>
          <div className="mission-card">
            <p>
              At Hobby Dating, our mission is to revolutionize the way people meet and connect 
              by putting shared interests and passions at the heart of every relationship. We believe 
              that lasting connections are built when people share common hobbies, values, and 
              aspirations—not just superficial attraction.
            </p>
            <p>
              We're committed to creating a safe, inclusive, and fun platform where every user 
              can express their true self, discover like-minded individuals, and build meaningful 
              relationships based on genuine compatibility.
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="vision-section">
        <div className="container">
          <h2>Our Vision</h2>
          <div className="vision-cards">
            <div className="vision-card">
              <div className="vision-icon">🌍</div>
              <h3>Global Community</h3>
              <p>
                To build a global community of millions of people united by their passions, 
                where geography is no barrier to finding your perfect match.
              </p>
            </div>
            <div className="vision-card">
              <div className="vision-icon">❤️</div>
              <h3>Meaningful Connections</h3>
              <p>
                Every profile tells a story. We're dedicated to helping you find someone who 
                celebrates your hobbies as much as you do.
              </p>
            </div>
            <div className="vision-card">
              <div className="vision-icon">🔒</div>
              <h3>Trust & Safety</h3>
              <p>
                A platform built on transparency, verification, and respect—where every user 
                feels secure and valued.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Story Section */}
      <section className="founder-section">
        <div className="container">
          <h2>Founder's Story</h2>
          <div className="founder-content">
            <div className="founder-text">
              <p>
                Hobby Dating was born from a simple observation: traditional dating apps focus on 
                physical attraction and location, but they miss what matters most—shared passion.
              </p>
              <p>
                Our founder spent years frustrated with dating apps that matched them with people 
                they had nothing in common with. As someone passionate about photography, travel, 
                and music, they dreamed of a platform that would first connect on interests, then 
                explore attraction.
              </p>
              <p>
                That dream became Hobby Dating. In just a year, we've grown from a concept to a 
                thriving community of over 50,000+ passionate individuals across India, all seeking 
                love rooted in shared hobbies.
              </p>
              <p>
                Today, we're on a mission to prove that the best relationships start with a 
                conversation about what you love—before anything else.
              </p>
            </div>
            <div className="founder-image">
              <img 
                src="https://via.placeholder.com/300?text=Founder" 
                alt="Founder" 
                className="founder-photo"
              />
              <h3>Bhargav Guduru</h3>
              <p className="founder-title">Founder & CEO</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <h3>🎯 Authenticity</h3>
              <p>Be yourself. Share your true passions and interests.</p>
            </div>
            <div className="value-item">
              <h3>🤝 Inclusivity</h3>
              <p>Everyone deserves love. We welcome all genders, orientations, and hobbies.</p>
            </div>
            <div className="value-item">
              <h3>🔐 Privacy</h3>
              <p>Your data is yours. We never compromise on user privacy and security.</p>
            </div>
            <div className="value-item">
              <h3>💡 Innovation</h3>
              <p>Constantly improving to deliver the best hobby-based matching experience.</p>
            </div>
            <div className="value-item">
              <h3>😊 Fun</h3>
              <p>Dating should be fun! We celebrate the lighter side of finding love.</p>
            </div>
            <div className="value-item">
              <h3>🌟 Excellence</h3>
              <p>We sweat the details to ensure every user has an amazing experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Find Your Match?</h2>
          <p>Join thousands of users finding love through shared passions.</p>
          <div className="cta-buttons">
            <button className="btn btn-primary">Sign Up Now</button>
            <button className="btn btn-secondary">Learn More</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
