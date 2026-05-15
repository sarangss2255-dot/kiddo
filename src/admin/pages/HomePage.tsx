import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BellRing,
  ChartColumn,
  Gamepad2,
  Shield,
  Sparkles,
  Star,
  Trophy,
  Users,
} from 'lucide-react';
import { brandContent, marketingContent } from '../common/content';
import { marketingNavItems } from '../common/navigation';

const featureIcons = {
  roles: Users,
  realtime: BellRing,
  gamified: Trophy,
  security: Shield,
};

export function HomePage() {
  return (
    <div className="landing-shell">
      <header className="marketing-header">
        <Link to="/" className="marketing-brand">
          <Sparkles size={18} />
          <span>{brandContent.name}</span>
        </Link>

        <nav className="marketing-nav">
          {marketingNavItems.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
          <Link to="/admin/login" className="nav-admin-link">
            Admin Login
          </Link>
        </nav>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <p className="hero-kicker">{brandContent.heroKicker}</p>
            <h1>{brandContent.heroTitle}</h1>
            <p className="hero-text">{brandContent.heroText}</p>
            <div className="hero-actions">
              <a href="#screens" className="hero-primary">
                Explore the app
              </a>
              <Link to="/admin/login" className="hero-secondary">
                Admin access <ArrowRight size={16} />
              </Link>
            </div>

            <div className="hero-stats">
              {marketingContent.stats.map((stat) => (
                <div key={stat.value}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="device-stack">
              <div className="device-mock device-mock--child">
                <div className="device-bar" />
                <div className="screen-card screen-card--sun">
                  <span className="screen-pill">Child dashboard</span>
                  <h3>Mission Time</h3>
                  <p>3 active tasks • 7 day streak</p>
                  <div className="mock-task mock-task--blue">
                    <strong>Clean study desk</strong>
                    <span>+20 pts</span>
                  </div>
                  <div className="mock-task mock-task--green">
                    <strong>Read 20 minutes</strong>
                    <span>+15 pts</span>
                  </div>
                </div>
              </div>

              <div className="device-mock device-mock--parent">
                <div className="device-bar" />
                <div className="screen-card screen-card--mint">
                  <span className="screen-pill">Parent dashboard</span>
                  <h3>Family Progress</h3>
                  <p>Approve wins and assign new missions</p>
                  <div className="metric-strip">
                    <div>
                      <strong>12</strong>
                      <span>Tasks</span>
                    </div>
                    <div>
                      <strong>240</strong>
                      <span>Points</span>
                    </div>
                    <div>
                      <strong>4</strong>
                      <span>Rewards</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dashboard-preview">
                <div className="dashboard-preview__header">
                  <Shield size={16} />
                  <span>Admin analytics</span>
                </div>
                <div className="dashboard-bars">
                  <span style={{ height: '40%' }} />
                  <span style={{ height: '65%' }} />
                  <span style={{ height: '82%' }} />
                  <span style={{ height: '58%' }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="feature-section">
          <div className="section-intro">
            <p className="eyebrow">Platform features</p>
            <h2>Built for families, designed for momentum.</h2>
          </div>

          <div className="feature-grid">
            {marketingContent.platformFeatures.map((feature) => {
              const Icon = featureIcons[feature.key as keyof typeof featureIcons];
              return (
                <article key={feature.title} className="feature-card">
                  <div className="feature-icon">
                    <Icon size={20} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="screens" className="screens-section">
          <div className="section-intro">
            <p className="eyebrow">App views</p>
            <h2>Preview the product experience.</h2>
          </div>

          <div className="screens-grid">
            {marketingContent.screenCards.map((screen) => (
              <article key={screen.key} className="shot-card">
                <div
                  className={
                    screen.theme === 'panel'
                      ? 'shot-panel'
                      : `shot-phone ${screen.theme === 'amber' ? 'shot-phone--amber' : 'shot-phone--blue'}`
                  }
                >
                  <div className="shot-header">
                    <span>{screen.label}</span>
                    {screen.key === 'child' ? (
                      <Star size={14} />
                    ) : screen.key === 'parent' ? (
                      <Users size={14} />
                    ) : (
                      <ChartColumn size={14} />
                    )}
                  </div>
                  <h3>{screen.title}</h3>
                  <p>{screen.text}</p>
                  {'rows' in screen && screen.rows ? (
                    <div className="shot-list">
                      {screen.rows.map((row) => (
                        <div key={row}>
                          <span /> {row}
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {'summary' in screen && screen.summary ? (
                    <div className="parent-summary">
                      {screen.summary.map((item) => (
                        <div key={item.label}>
                          <strong>{item.value}</strong>
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {screen.theme === 'panel' ? (
                    <div className="panel-chart">
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="roles" className="role-section">
          <div className="role-column role-column--parent">
            <p className="eyebrow">For parents</p>
            <h2>Clean control without complexity.</h2>
            <ul>
              {marketingContent.parentFeatures.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="role-column role-column--child">
            <p className="eyebrow">For children</p>
            <h2>Colorful, animated, and built to feel rewarding.</h2>
            <ul>
              {marketingContent.childFeatures.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="admin" className="admin-callout">
          <div>
            <p className="eyebrow">Admin access</p>
            <h2>The admin panel stays available, but it does not dominate the public site.</h2>
            <p>
              Platform administrators can sign in from the compact navbar link and access analytics,
              user management, moderation tools, and system settings.
            </p>
          </div>

          <Link to="/admin/login" className="callout-button">
            Open admin login <ArrowRight size={16} />
          </Link>
        </section>

        <section className="closing-strip">
          <div className="closing-card">
            <Gamepad2 size={20} />
            <div>
              <strong>Playful for kids</strong>
              <span>Gamified mobile flows with points, streaks, and mini-game hooks.</span>
            </div>
          </div>
          <div className="closing-card">
            <Shield size={20} />
            <div>
              <strong>Reliable for parents</strong>
              <span>Role-based auth, clean APIs, and structured oversight.</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
