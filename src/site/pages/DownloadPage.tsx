import { Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { SiteHeader } from '../components/SiteHeader';
import { siteContent } from '../content';

export function DownloadPage() {
  return (
    <div className="download-shell">
      <div className="site-glow site-glow--sun" />
      <SiteHeader />

      <main className="download-main">
        <Reveal className="download-card" delayMs={50}>
          <div className="download-card__badge">
            <Download size={18} />
            Android APK
          </div>
          <h1>Download the KidDo mobile app</h1>
          <p>
            Install the latest Android build to access parent dashboards, kid missions, streaks, and reward flows on
            mobile. This web app is the publishable download surface for your project.
          </p>

          <img src="/kiddo-logo.png" alt="KidDo App logo" className="download-card__logo" />

          <a className="download-button" href="/kiddo-app.apk" download>
            <Download size={20} />
            Download kiddo-app.apk
          </a>

          <div className="download-notes">
            {siteContent.downloadNotes.map((note, index) => (
              <div key={note}>
                <strong>{`0${index + 1}`}</strong>
                <span>{note}</span>
              </div>
            ))}
            <div>
              <strong>Admin</strong>
              <span>
                Platform staff should use <Link to="/admin/login">`/admin/login`</Link> instead of this page.
              </span>
            </div>
          </div>
        </Reveal>
      </main>
    </div>
  );
}
