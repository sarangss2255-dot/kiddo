import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { UsersPage } from './pages/UsersPage';
import { TasksPage } from './pages/TasksPage';
import { RewardsPage } from './pages/RewardsPage';
import { SettingsPage } from './pages/SettingsPage';
import { HomePage } from './pages/HomePage';
import { useAuth } from './context/AuthContext';

function ProtectedApp() {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/admin/leaderboard" element={<LeaderboardPage />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/tasks" element={<TasksPage />} />
        <Route path="/admin/rewards" element={<RewardsPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
      </Routes>
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<ProtectedApp />} />
      <Route path="/admin/leaderboard" element={<ProtectedApp />} />
      <Route path="/admin/users" element={<ProtectedApp />} />
      <Route path="/admin/tasks" element={<ProtectedApp />} />
      <Route path="/admin/rewards" element={<ProtectedApp />} />
      <Route path="/admin/settings" element={<ProtectedApp />} />
    </Routes>
  );
}
