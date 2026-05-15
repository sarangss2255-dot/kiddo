import { Link } from 'react-router-dom';

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link to="/" className="site-brand">
        <img src="/kiddo-logo.png" alt="KidDo App logo" className="site-brand__logo" />
        <span className="site-brand__wordmark">
          <strong>KidDo App</strong>
          <small>Little tasks, big smiles.</small>
        </span>
      </Link>

      <nav className="site-nav">
        <a href="/#features">Features</a>
        <a href="/#journey">Journey</a>
        <a href="/#publish">Download</a>
        <Link to="/admin/login" className="site-nav__admin">
          Admin login
        </Link>
      </nav>
    </header>
  );
}
