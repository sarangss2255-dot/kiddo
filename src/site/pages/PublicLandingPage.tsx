import { Download, Gamepad2, LockKeyhole, ShieldCheck, Smartphone, Sparkles, Stars, Trophy, Users } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { SiteHeader } from '../components/SiteHeader';
import { siteContent } from '../content';

export function PublicLandingPage() {
  const heroVisualRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateParallax = () => {
      if (!heroVisualRef.current) {
        return;
      }

      const offset = window.scrollY * 0.08;
      heroVisualRef.current.style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener('scroll', updateParallax, { passive: true });

    return () => window.removeEventListener('scroll', updateParallax);
  }, []);

  const featureIcons = [Smartphone, Trophy, Users, Sparkles];
  const journeyIcons = [Users, Smartphone, Trophy, LockKeyhole];

  return (
    <div className="marketing-site">
      <div className="site-glow site-glow--sun" />
      <div className="site-glow site-glow--mint" />
      <SiteHeader />

      <main className="page-shell">
        <section className="hero-band">
          <Reveal className="hero-copy" delayMs={40}>
            <span className="eyebrow">{siteContent.hero.kicker}</span>
            <h1>{siteContent.hero.title}</h1>
            <p>{siteContent.hero.body}</p>

            <div className="hero-actions">
              <Link to="/download" className="button primary">
                <Download size={18} />
                Download Android app
              </Link>
              <a className="button ghost" href="#journey">
                View app flow
              </a>
            </div>

            <div className="hero-pill-row">
              {siteContent.hero.pills.map((pill) => (
                <span key={pill}>{pill}</span>
              ))}
            </div>
          </Reveal>

          <div ref={heroVisualRef} className="hero-visual">
            <Reveal className="device-card" delayMs={120}>
              <div className="device-top">
                <span className="dot coral" />
                <span className="dot gold" />
                <span className="dot mint" />
              </div>

              <div className="quest-card sky">
                <p className="label">Today&apos;s missions</p>
                <h3>Morning Wins</h3>
                <ul>
                  <li>Brush teeth</li>
                  <li>Pack school bag</li>
                  <li>Water the plant</li>
                </ul>
              </div>

              <div className="stats-row">
                <div className="mini-card">
                  <span>Streak</span>
                  <strong>12 days</strong>
                </div>
                <div className="mini-card">
                  <span>Stars earned</span>
                  <strong>240</strong>
                </div>
              </div>
            </Reveal>

            <Reveal className="bubble bubble-a float" delayMs={160}>
              <Trophy size={16} />
              <span>+20 stars</span>
            </Reveal>
            <Reveal className="bubble bubble-b float slow" delayMs={220}>
              <Stars size={16} />
              <span>Level up</span>
            </Reveal>
            <Reveal className="bubble bubble-c float" delayMs={280}>
              <ShieldCheck size={16} />
              <span>Parent approved</span>
            </Reveal>
          </div>
        </section>

        <section id="features" className="section grid-section">
          <Reveal className="section-heading" delayMs={40}>
            <span className="eyebrow">Core features</span>
            <h2>What the app shows families at a glance</h2>
          </Reveal>

          <div className="feature-grid">
            {siteContent.featureCards.map((feature, index) => {
              const Icon = featureIcons[index] ?? Sparkles;
              return (
                <Reveal key={feature.title} delayMs={100 + index * 70}>
                  <article className="feature-card">
                    <span>{feature.number}</span>
                    <div className="feature-card__icon">
                      <Icon size={18} />
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.text}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section id="journey" className="section story-section">
          <Reveal className="section-heading" delayMs={50}>
            <span className="eyebrow">App flow</span>
            <h2>How a normal day works inside KidDo</h2>
          </Reveal>

          <div className="timeline">
            {siteContent.journey.map((item, index) => {
              const Icon = journeyIcons[index] ?? Stars;
              return (
                <Reveal key={item.step} delayMs={120 + index * 70}>
                  <article className="timeline-card">
                    <div className="timeline-step">
                      <span>{item.step}</span>
                      <Icon size={16} />
                    </div>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className="section rewards-section">
          <Reveal className="reward-panel" delayMs={60}>
            <div className="reward-copy">
              <span className="eyebrow">Why it works</span>
              <h2>Built to feel fun for kids and dependable for parents</h2>
              <p>
                The app combines playful visuals, clear progress, and reward feedback with a calm structure that makes
                family task management easier.
              </p>
            </div>

            <div className="reward-stack">
              {siteContent.rewards.map((reward, index) => (
                <Reveal key={reward.title} delayMs={140 + index * 70}>
                  <article className="reward-card">
                    <span className="reward-tag">{reward.tag}</span>
                    <strong>{reward.title}</strong>
                    <p>{reward.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="publish" className="section publish-section">
          <Reveal className="section-heading" delayMs={60}>
            <span className="eyebrow">Publish and access</span>
            <h2>Use this site for the two actions visitors actually need</h2>
          </Reveal>

          <div className="action-grid">
            <Reveal delayMs={120}>
              <Link to="/download" className="action-card">
                <Download size={22} />
                <strong>Mobile app download</strong>
                <span>Serve the Android APK from Netlify and guide parents straight into installation.</span>
              </Link>
            </Reveal>

            <Reveal delayMs={180}>
              <Link to="/admin/login" className="action-card action-card--dark">
                <LockKeyhole size={22} />
                <strong>Admin login</strong>
                <span>Open the dashboard sign-in flow directly from a stable `/admin/login` route.</span>
              </Link>
            </Reveal>
          </div>

          <Reveal delayMs={240}>
            <div className="publish-ribbon">
              <div>
                <Sparkles size={18} />
                <span>Brand story for families</span>
              </div>
              <div>
                <Smartphone size={18} />
                <span>APK delivery for Android</span>
              </div>
              <div>
                <ShieldCheck size={18} />
                <span>Separate admin access</span>
              </div>
            </div>
          </Reveal>
        </section>

        <Reveal className="final-cta" delayMs={80}>
          <span className="eyebrow">Demo summary</span>
          <h2>KidDo presents chores, routines, rewards, and family progress in a polished web experience.</h2>
          <p>
            Use this site as the branded entry point for the Android app, then keep the admin panel available through
            its own direct login route.
          </p>
          <div className="final-cta__actions">
            <Link to="/download" className="button primary">
              <Download size={18} />
              Get the APK
            </Link>
            <Link to="/admin/login" className="button ghost">
              <Gamepad2 size={18} />
              Open admin
            </Link>
          </div>
        </Reveal>
      </main>
    </div>
  );
}
