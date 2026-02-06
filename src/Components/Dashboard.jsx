// import React from "react";
// import "./Dashboard.css"; // use a separate CSS file for dashboard

// function Dashboard() {
//   return (
//     <div className="dashboard-wrapper">
//       <div className="dashboard-container">
//         <h1>Welcome to Hobby Dating App ❤️</h1>
//         <p>Find people who share your hobbies and interests!</p>
//         <a href="/" className="dashboard-btn">Go Back Home</a>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;



import React from 'react';
import './Dashboard.css';
import { Link, useNavigate } from "react-router-dom";


const profiles = [
    { name: 'Angelica', age: 27, img: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { name: 'Norman', age: 29, img: 'https://randomuser.me/api/portraits/men/45.jpg' },
    { name: 'Janine', age: 23, img: 'https://randomuser.me/api/portraits/women/65.jpg', desc: "Love to travel and discover beautiful places." },
    { name: 'Angelica', age: 28, img: 'https://randomuser.me/api/portraits/women/44.jpg', desc: "Looking for my kind of man." },
    { name: 'Alexander', age: 32, img: 'https://randomuser.me/api/portraits/men/12.jpg' },
    { name: 'Francia', age: 34, img: 'https://randomuser.me/api/portraits/women/12.jpg' },
    { name: 'Robert', age: 47, img: 'https://randomuser.me/api/portraits/men/15.jpg' },
];

const features = [
    { title: 'Protection', desc: 'Your safety is provided by leading anti-scam system.', icon: '🛡️' },
    { title: 'Verification', desc: 'All members are personally confirmed by our staff.', icon: '📨' },
    { title: 'Attention', desc: 'Receive lots of attention from attractive members online.', icon: '📣' },
    { title: 'Communication', desc: 'Chat, send letters, call, share your photos and videos.', icon: '💬' },
];

const howItWorks = [
    { step: '01', title: 'Protection', desc: 'Create your profile by providing all necessary details.' },
    { step: '02', title: 'Find Match', desc: 'Look for your soulmate over this dating platform.' },
    { step: '03', title: 'Start Dating', desc: 'Start a new journey with your life partner.' },
];

const successStories = [
    { title: 'Carmie & Lawrence', desc: 'One word frees us of all the weight and pain in life.', img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80' },
    { title: 'Francia & Mark', desc: 'Kindness in words creates confidence. Kindness in thinking creates profoundness.', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
    { title: 'Angelica & Norman', desc: 'There is always some madness in love but there is also always some reason.', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80' },
];

export default function Dashboard() {
    const navigate = useNavigate();
    return (
        <div className="dashboard">
            <header className="header container">
                <div className="logo" onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
                    Hobby Dating
                </div>                <nav className="nav">
                    <Link to="/dashboard">Home</Link>
                    <Link to="/about">About</Link>
                    <Link to="/services">Services</Link>
                    <Link to="/why-us">Why Us</Link>
                    <Link to="/contact">Contact</Link>
                    <button
                        className="btn-outline"
                        onClick={() => {
                            navigate("/login");    // navigate to login page
                            console.log("bhargav"); // log something
                        }}
                    >
                        Login
                    </button>


                    <button
                        className="btn-gradient"
                        onClick={() => navigate("/signup")}
                    >
                        Join Now
                    </button>
                </nav>
            </header>

            {/* Hero */}
            <section className="hero container">
                <div className="hero-text">
                    <h1>
                        Love what you <br />
                        <span>Do Together</span><br />
                        On Cherish
                    </h1>

                    <p>We help our members find meaningful connections, so every love story has the chance to flourish.</p>
                    <button
                        className="btn-gradient"
                        onClick={() => navigate("/signup")}
                    >
                        Get Started
                    </button>
                </div>
                <div className="hero-profiles">
                    {profiles.slice(0, 2).map(({ name, age, img }, i) => (
                        <div key={i} className="profile-card">
                            <img src={img} alt={name} />
                            <div className="profile-info">
                                <span>{name}, {age}</span>
                                <svg className="heart-icon" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
                           4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 
                           16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 
                           11.54L12 21.35z" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* New Added Profiles */}
            <section className="new-profiles container">
                <h2>New added profiles</h2>
                <p>You are few steps away from meeting your special someone.</p>
                <div className="new-profile-list">
                    {profiles.map(({ name, age, img, desc }, i) => (
                        <div key={i} className="new-profile-card">
                            <img src={img} alt={name} />
                            <div className="new-profile-info">
                                <h4>{name}, {age}</h4>
                                {desc && <p>{desc}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why choose us */}
            <section className="why-choose-us">
                <div className="container">
                    <h2>Why choose us?</h2>
                    <p>Let’s find you life partner to enjoy life to be better and prosperous!</p>
                    <div className="features-grid">
                        {features.map(({ icon, title, desc }, i) => (
                            <div key={i} className="feature-card">
                                <div className="feature-icon">{icon}</div>
                                <div className="feature-title">{title}</div>
                                <div className="feature-desc">{desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="how-it-works container">
                <h2>How it works</h2>
                <p>
                    Cherish is a dating platform that will help you out for this.<br />
                    All you need to do is to follow these steps, and soon you will be dating the love of your life.
                </p>
                <div className="steps">
                    {howItWorks.map(({ step, title, desc }, i) => (
                        <div key={i} className="step-item">
                            <div className="step-number">{step}</div>
                            <div className="step-circle">
                                <svg viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" />
                                </svg>
                            </div>
                            <div className="step-content">
                                <div className="step-title">{title}</div>
                                <div className="step-desc">{desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* People Joined */}
            <section className="people-joined container">
                <h2>People joined already!</h2>
                <div className="people-stats">
                    <div><span className="number">1800</span>Total Members</div>
                    <div><span className="number">1280</span>Online Members</div>
                    <div><span className="number">480</span>Women Online</div>
                    <div><span className="number">600</span>Men Online</div>
                </div>
            </section>

            {/* Success Stories */}
            <section className="success-stories container">
                <h2>Success Stories</h2>
                <div className="story-list">
                    {successStories.map(({ title, desc, img }, i) => (
                        <div key={i} className="story-card">
                            <img src={img} alt={title} />
                            <div className="story-content">
                                <div className="story-title">{title}</div>
                                <div className="story-desc">{desc}</div>
                                <button className="read-more">Read More</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer>
                <div className="footer-container container">
                    <div className="footer-logo">cherish</div>
                    <div className="footer-section">
                        <h5>Our Company</h5>
                        <ul>
                            <li>About Us</li>
                            <li>Careers</li>
                            <li>Terms & Conditions</li>
                            <li>Privacy Policy</li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h5>Help Center</h5>
                        <ul>
                            <li>Help Center</li>
                            <li>FAQ</li>
                            <li>Report Abuse</li>
                            <li>Safety Tips</li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h5>Follow Us</h5>
                        <ul>
                            <li>Facebook</li>
                            <li>Twitter</li>
                            <li>Youtube</li>
                            <li>Instagram</li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h5>Contact Us</h5>
                        <ul>
                            <li>info@hda.com</li>
                            <li>(123) 0000 000</li>
                            <li>Location sample here</li>
                        </ul>
                    </div>
                    <div className="newsletter">
                        <input type="email" placeholder="Enter Email" />
                        <button>Submit</button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
