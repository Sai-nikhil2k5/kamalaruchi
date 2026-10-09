import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from './firebase';
import { UserProfile } from '../types';
import { fetchOrCreateUserProfile, logUserActivity, updateUserProfileDetails, isUserAdmin } from './dbService';

interface AuthContextType {
  user: { uid: string; email: string | null; displayName: string | null } | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  isOperationNotAllowed: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, displayName: string) => Promise<void>;
  signInPreviewDemo: (email?: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfileData: (updates: Partial<UserProfile>) => Promise<void>;
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_PREVIEW_USER_KEY = 'kamala_ruchi_preview_user';
const LOCAL_PREVIEW_PROFILE_KEY = 'kamala_ruchi_preview_profile';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ uid: string; email: string | null; displayName: string | null } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [isOperationNotAllowed, setIsOperationNotAllowed] = useState(false);

  useEffect(() => {
    // Check if there is an active local preview user session first
    const savedPreviewUser = localStorage.getItem(LOCAL_PREVIEW_USER_KEY);
    const savedPreviewProfile = localStorage.getItem(LOCAL_PREVIEW_PROFILE_KEY);

    if (savedPreviewUser && savedPreviewProfile) {
      try {
        setUser(JSON.parse(savedPreviewUser));
        setProfile(JSON.parse(savedPreviewProfile));
      } catch (e) {
        console.warn('Failed to parse saved preview user session:', e);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const simplifiedUser = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName,
        };
        setUser(simplifiedUser);
        try {
          const userProfile = await fetchOrCreateUserProfile({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            phoneNumber: fbUser.phoneNumber,
          });
          setProfile(userProfile);
          await logUserActivity('USER_LOGIN', `User session active: ${fbUser.email}`, {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
          });
        } catch (err) {
          console.error('Error fetching user profile from Firestore:', err);
          // If Firestore fails, still populate profile
          setProfile((prev) => prev || {
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Kamala Customer',
            role: isUserAdmin(fbUser.email) ? 'admin' : 'customer',
            phoneNumber: fbUser.phoneNumber || '',
            address: '',
            city: 'Hyderabad',
            pincode: '',
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            orderCount: 0,
            totalSpent: 0,
          });
        }
      } else {
        // If not in Firebase Auth, check if we had a preview user
        const localUser = localStorage.getItem(LOCAL_PREVIEW_USER_KEY);
        if (!localUser) {
          setUser(null);
          setProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const signIn = async (email: string, pass: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const p = await fetchOrCreateUserProfile({
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName,
      });
      setProfile(p);
      localStorage.removeItem(LOCAL_PREVIEW_USER_KEY);
      localStorage.removeItem(LOCAL_PREVIEW_PROFILE_KEY);
      closeAuthModal();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      if (errorMsg.includes('auth/operation-not-allowed')) {
        setIsOperationNotAllowed(true);
      }
      throw err;
    }
  };

  const signUp = async (email: string, pass: string, displayName: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (displayName.trim()) {
        await updateProfile(cred.user, { displayName: displayName.trim() });
      }
      const p = await fetchOrCreateUserProfile({
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: displayName.trim() || cred.user.email?.split('@')[0],
      });
      setProfile(p);
      localStorage.removeItem(LOCAL_PREVIEW_USER_KEY);
      localStorage.removeItem(LOCAL_PREVIEW_PROFILE_KEY);
      closeAuthModal();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      if (errorMsg.includes('auth/operation-not-allowed')) {
        setIsOperationNotAllowed(true);
      }
      throw err;
    }
  };

  // Instant preview demo sign in (unblocks testing immediately while Firebase Console setup is completed)
  const signInPreviewDemo = async (
    customEmail = 'kruchimade@gmail.com', 
    customName = 'Kamala Ruchi (Admin)'
  ) => {
    const isAdmin = isUserAdmin(customEmail);
    const mockUid = 'usr_' + Math.abs(customEmail.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)).toString(16);
    
    const mockUser = {
      uid: mockUid,
      email: customEmail,
      displayName: customName,
    };

    const mockProfile: UserProfile = {
      uid: mockUid,
      email: customEmail,
      displayName: customName,
      role: isAdmin ? 'admin' : 'customer',
      phoneNumber: '+91 98765 43210',
      address: 'Plot 42, Jubilee Hills, Heritage Enclave',
      city: 'Hyderabad',
      pincode: '500033',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      orderCount: 1,
      totalSpent: 420,
    };

    setUser(mockUser);
    setProfile(mockProfile);
    localStorage.setItem(LOCAL_PREVIEW_USER_KEY, JSON.stringify(mockUser));
    localStorage.setItem(LOCAL_PREVIEW_PROFILE_KEY, JSON.stringify(mockProfile));

    // Also attempt to save/log in Firestore if reachable
    try {
      await fetchOrCreateUserProfile(mockUser);
      await logUserActivity('USER_LOGIN', `User session active (Preview): ${customEmail}`, mockUser);
    } catch {
      // Graceful local fallback
    }

    closeAuthModal();
  };

  const signOut = async () => {
    if (user) {
      await logUserActivity('USER_LOGOUT', `User logged out: ${user.email}`, {
        uid: user.uid,
        email: user.email,
        displayName: profile?.displayName,
      });
    }
    localStorage.removeItem(LOCAL_PREVIEW_USER_KEY);
    localStorage.removeItem(LOCAL_PREVIEW_PROFILE_KEY);
    try {
      await fbSignOut(auth);
    } catch {
      // Ignored
    }
    setUser(null);
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateProfileData = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return;
    const updated = { ...profile, ...updates };
    setProfile(updated);
    localStorage.setItem(LOCAL_PREVIEW_PROFILE_KEY, JSON.stringify(updated));

    try {
      await updateUserProfileDetails(user.uid, updates);
      await logUserActivity('UPDATE_PROFILE', 'User updated contact/delivery address', {
        uid: user.uid,
        email: user.email,
        displayName: profile.displayName,
      });
    } catch (e) {
      console.warn('Could not sync profile update to remote Firestore:', e);
    }
  };

  const isAdmin = profile?.role === 'admin' || isUserAdmin(profile?.email) || isUserAdmin(user?.email);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin,
        loading,
        isOperationNotAllowed,
        signIn,
        signUp,
        signInPreviewDemo,
        signOut,
        resetPassword,
        updateProfileData,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
        authModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
