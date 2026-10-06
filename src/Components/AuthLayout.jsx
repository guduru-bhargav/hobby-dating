import { Link } from "react-router-dom";
import Icon from "./Icon";
import "./Auth.css";

const POINTS = [
  { icon: "shield", text: "Verified members and a safety-first community" },
  { icon: "heart", text: "Match on shared hobbies, not just photos" },
  { icon: "chat", text: "Chat one-on-one in real time" },
];

// Two-panel shell shared by login, signup and password pages
function AuthLayout({ title, subtitle, children, footer, wide = false }) {
  return (
    <div className="auth-page">
      <aside className="auth-hero">
        <Link to="/dashboard" className="auth-brand">
          <span className="brand-mark"><Icon name="logo" size={18} /></span>
          Cherish
        </Link>

        <div className="auth-hero-copy">
          <h1>Find someone who shares your passions.</h1>
          <ul>
            {POINTS.map((p) => (
              <li key={p.text}>
                <span className="auth-point-icon"><Icon name={p.icon} size={16} /></span>
                {p.text}
              </li>
            ))}
          </ul>
        </div>

        <p className="auth-hero-foot">Built for real connections · Hobby Dating</p>
      </aside>

      <main className="auth-main">
        <div className={`auth-card ${wide ? "auth-card-wide" : ""}`}>
          <Link to="/dashboard" className="auth-brand auth-brand-mobile">
            <span className="brand-mark"><Icon name="logo" size={16} /></span>
            Cherish
          </Link>
          <header className="auth-head">
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </header>
          {children}
          {footer && <div className="auth-footer">{footer}</div>}
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;
