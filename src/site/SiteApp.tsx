import { Navigate, Route, Routes } from 'react-router-dom';
import { PublicLandingPage } from './pages/PublicLandingPage';
import { DownloadPage } from './pages/DownloadPage';
import './site.css';

export function SiteApp() {
  return (
    <Routes>
      <Route path="/" element={<PublicLandingPage />} />
      <Route path="/download" element={<DownloadPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
