import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Rocket, Heart, Zap, Star } from 'lucide-react';
import '../landing.css';

const features = [
  { title: 'Parental Controls', text: 'Approve tasks and manage rewards with clarity.', icon: <Star /> },
  { title: 'Gamified Progress', text: 'Kids earn points and streaks they can see.', icon: <Zap /> },
  { title: 'Quick Setup', text: 'Create routines in minutes and share with family.', icon: <Heart /> },
  { title: 'Secure', text: 'Role-based access keeps parents in control.', icon: <Star /> },
  { title: 'Offline Ready', text: 'Use core features even without connection.', icon: <Zap /> },
  { title: 'Reports', text: 'Easy insights on habits and progress.', icon: <Heart /> },
];

export function PublicLandingPage() {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <header className="landing-header">
        <div className="brand">KidDo</div>
        <nav className="nav">
          <a href="#features">Features</a>
          <a href="#gallery">Gallery</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="cta" href="#contact">Get Early Access</a>
      </header>

      <section className="hero-split">
        <div className="hero-left">
          <div className="badge">Powered by Performance</div>
          <h1>
            Transform <span className="underline">Routines</span> into Rituals
          </h1>
          <p>Make chores and routines meaningful with clear progress, rewards, and family-friendly design.</p>
          <a className="primary" href="#download">Download APK</a>
        </div>

        <div className="hero-visual">
          <div className="phone-3d">
            <div className="phone-wrap">
              <div className="phone" />
            </div>
            <div className="floating-badge badge-a">🔥 420 kcal</div>
            <div className="floating-badge badge-b">❤️ 98 bpm</div>
            <div className="floating-badge badge-c">🌟 7 streak</div>
          </div>
        </div>
      </section>

      <section id="features" className="feature-grid">
        {features.map((f) => (
          <div key={f.title} className="tilt-card">
            <div className="icon-box">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </section>

      <section id="gallery" className="screenshot-row">
        <div className="screenshot left2" />
        <div className="screenshot left1" />
        <div className="screenshot center" />
        <div className="screenshot right1" />
        <div className="screenshot right2" />
      </section>

      <section className="visual-cta">
        <div className="content">
          <div className="icon-large"><Rocket size={36} /></div>
          <h2>Bring play to progress</h2>
          <div className="download-row">
            <a className="button primary" href="#download">Download APK</a>
            <div style={{ width: 12 }} />
            <a className="store-btn" href="#">App Store</a>
            <a className="store-btn" href="#">Google Play</a>
          </div>
        </div>
      </section>
    </div>
  );
}
