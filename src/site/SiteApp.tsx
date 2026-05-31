import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { FeatureGrid } from '../components/FeatureGrid';
import { Footer } from '../components/Footer';
import { ErrorBoundary } from '../components/ErrorBoundary';
import './site.css';

const PublicLandingPage = lazy(() => import('./pages/PublicLandingPage').then(m => ({ default: m.PublicLandingPage })));
const DownloadPage = lazy(() => import('./pages/DownloadPage').then(m => ({ default: m.DownloadPage })));
const AuthPage = lazy(() => import('./pages/app/AuthPage').then(m => ({ default: m.AuthPage })));
const KiddoApp = lazy(() => import('./pages/app/KiddoApp').then(m => ({ default: m.KiddoApp })));

// The new home page assembly using brutalist theme
const TradingLanding = () => (
  <>
    <Hero />
    <FeatureGrid />
  </>
);

export default function SiteApp() {
  return (
    <div className="min-h-screen relative bg-[#121212] text-white">
      <div className="relative z-10 pb-16">
        <Header />
        <main>
          <ErrorBoundary>
            <Suspense fallback={<div className="p-8 text-center font-label font-bold text-white uppercase">INITIALIZING...</div>}>
              <Routes>
                <Route path="/" element={<TradingLanding />} />
                <Route path="/download" element={<DownloadPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/app/*" element={<KiddoApp />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </div>
  );
}
