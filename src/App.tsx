import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './AuthContext';
import { View, ActivityIndicator } from 'react-native';

const Stack = createStackNavigator();

// Lazy loading doesn't work the same in RN as web, using standard imports for stability
import Login from './pages/Login';
import AdminApp from './admin/App';
import { AuthProvider as AdminAuthProvider } from './admin/context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import './admin/styles.css';
import { applyTheme } from './admin/common/theme';

if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
  applyTheme();
}

function AdminRoot() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <AdminApp />
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
import KidDashboard from './pages/KidDashboard';
import ParentDashboard from './pages/ParentDashboard';
import Onboarding from './pages/Onboarding';
import LandingPage from './pages/LandingPage';
import DownloadsPage from './pages/DownloadsPage';

function Navigation() {
  const { user, profile, loading, isAuthReady } = useAuth();

  if (!isAuthReady || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fffbeb' }}>
        <ActivityIndicator size="large" color="#f59e0b" />
      </View>
    );
  }

  return (
    <Stack.Navigator id="root" screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Landing" component={LandingPage} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Downloads" component={DownloadsPage} />
        </>
      ) : !profile ? (
        <Stack.Screen name="Onboarding" component={Onboarding} />
      ) : (
        <>
          {profile.role === 'kid' && (
            <Stack.Screen name="KidDashboard" component={KidDashboard} />
          )}
          {(profile.role === 'parent' || profile.role === 'admin') && (
            <Stack.Screen name="ParentDashboard" component={ParentDashboard} />
          )}
          <Stack.Screen name="Downloads" component={DownloadsPage} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <AdminRoot />;
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </AuthProvider>
  );
}
