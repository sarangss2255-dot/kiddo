import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './site.css';

const PublicLandingPage = () => (
  <div className="p-8 text-center text-white bg-[#121212]">
    <h1 className="text-3xl font-bold">Kiddo Home</h1>
    <p className="mt-2">Welcome to Kiddo App.</p>
  </div>
);

const DownloadPage = () => (
  <div className="p-8 text-center text-white bg-[#121212]">
    <h1 className="text-3xl font-bold">Download</h1>
    <p className="mt-2">Download the app here.</p>
  </div>
);

const AuthPage = () => (
  <div className="p-8 text-center text-white bg-[#121212]">
    <h1 className="text-3xl font-bold">Login / Signup</h1>
    <p className="mt-2">Authentication coming soon.</p>
  </div>
);

const KiddoApp = () => (
  <div className="p-8 text-center text-white bg-[#121212]">
    <h1 className="text-3xl font-bold">Kid Dashboard</h1>
    <p className="mt-2">Your missions and games.</p>
  </div>
);
export function SiteApp() {
  return (
    <div className="p-8 text-center text-white bg-[#121212]">
      <h1 className="text-3xl font-bold">Kiddo Site</h1>
      <p className="mt-2">Site is working.</p>
    </div>
  );
}
