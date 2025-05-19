
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase/firebaseConfig';
import { useLanguage } from './LanguageContext';
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean; // Firebase auth loading
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Firebase auth loading

  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged will handle setting currentUser and isLoading
      toast({ title: t.authLoginSuccessTitle, description: t.authLoginSuccessDescription });
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        console.log("Login popup closed or cancelled by user.");
        // No toast for user cancellation
      } else {
        toast({ title: t.errorDialogTitle, description: t.authLoginError, variant: "destructive" });
      }
      setIsLoading(false); 
    }
  };

  const signOutUser = async () => {
    setIsLoading(true); 
    try {
      await signOut(auth);
      // onAuthStateChanged will handle setting currentUser to null and isLoading to false
      toast({ title: t.authLogoutSuccessTitle, description: t.authLogoutSuccessDescription });
    } catch (error) {
      console.error("Sign-Out Error:", error);
      toast({ title: t.errorDialogTitle, description: t.authLogoutError, variant: "destructive" });
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isLoading, 
      signInWithGoogle, 
      signOutUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
