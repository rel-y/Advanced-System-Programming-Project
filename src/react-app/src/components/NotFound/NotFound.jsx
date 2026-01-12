import { Link, useLocation } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  const location = useLocation();

  return (
    <div className="nf-page">
      <div className="nf-card">
        <div className="nf-badge">404</div>

        <h1 className="nf-title">Page not found</h1>
        <p className="nf-subtitle">
          No route matches <span className="nf-path">{location.pathname}</span>
        </p>

        <div className="nf-actions">
          <Link className="nf-btn nf-primary" to="/">
            Go home
          </Link>
          <button
            className="nf-btn nf-secondary"
            onClick={() => window.history.back()}
          >
            Go back
          </button>
        </div>

        <div className="nf-hint">
          Check the URL or use the navigation to continue.
        </div>
      </div>
    </div>
  );
}
