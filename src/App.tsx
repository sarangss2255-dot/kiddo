import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminApp from './admin/App';
import { AuthProvider as AdminAuthProvider } from './admin/context/AuthContext';
import { SiteApp } from './site/SiteApp';
import './admin/styles.css';
import { applyTheme } from './admin/common/theme';

if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
  applyTheme();
}

function AdminRoot() {
  return (
    <AdminAuthProvider>
      <AdminApp />
    </AdminAuthProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminRoot />} />
        <Route path="/*" element={<SiteApp />} />
      </Routes>
    </BrowserRouter>
  );
}
