import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { UsersPage } from './pages/UsersPage';
import { TasksPage } from './pages/TasksPage';
import { RewardsPage } from './pages/RewardsPage';
import { SettingsPage } from './pages/SettingsPage';
import { useAuth } from './context/AuthContext';

function ProtectedApp() {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/rewards" element={<RewardsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={<ProtectedApp />} />
    </Routes>
  );
}
