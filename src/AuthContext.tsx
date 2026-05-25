import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import { UserProfile } from './types';
import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthReady: boolean;
  refreshProfile: () => Promise<void>;
}

const PROFILE_KEY = 'kiddo_profile';

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAuthReady: false,
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Load cached profile on startup
  useEffect(() => {
    const loadCached = async () => {
      try {
        const cached = await AsyncStorage.getItem(PROFILE_KEY);
        if (cached) {
          setProfile(JSON.parse(cached));
          // If we have a cached profile, we can stop showing the main spinner 
          // while Firebase/API syncs in the background
          setLoading(false);
        }
      } catch (e) {
        console.error("Error loading cached profile:", e);
      }
    };
    loadCached();
  }, []);

  const refreshProfile = async () => {
    if (!auth.currentUser) return;
    try {
      const data = await api.get('/auth/me');
      if (data) {
        const newProfile = {
          uid: data._id,
          email: data.email,
          displayName: data.firstName || data.displayName,
          role: data.role,
          familyId: data.familyId ? String(data.familyId) : undefined,
          points: data.points,
          avatar: data.avatar,
          chessWins: data.chessWins,
          chessGamesPlayed: data.chessGamesPlayed,
          lastChessRewardAt: data.lastChessRewardAt,
        } as UserProfile;
        
        setProfile(newProfile);
        await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
      }
    } catch (error) {
      console.error("Profile sync error:", error);
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthReady(true);
      
      if (firebaseUser) {
        // Cache token immediately
        const token = await firebaseUser.getIdToken();
        await api.setToken(token);
      } else {
        // Clear everything if not authenticated
        setProfile(null);
        await AsyncStorage.removeItem(PROFILE_KEY);
        await api.setToken(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      refreshProfile().finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAuthReady, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
