
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase/firebaseConfig';
import { useLanguage } from './LanguageContext'; // For toast messages
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
      // onAuthStateChanged will handle setting currentUser
      toast({ title: t.authLoginSuccessTitle, description: t.authLoginSuccessDescription });
      // isLoading will be set to false by onAuthStateChanged
    } catch (error: any) { // Add 'any' type for error to check code
      console.error("Google Sign-In Error:", error);
      // Check if the error code is 'auth/popup-closed-by-user'
      if (error.code === 'auth/popup-closed-by-user') {
        // Optionally, handle this specific case differently, e.g., no toast or a specific message
        console.log("Login popup closed by user.");
      } else if (error.code === 'auth/cancelled-popup-request') {
        console.log("Multiple login popups cancelled.");
      } else {
        toast({ title: t.errorDialogTitle, description: t.authLoginError, variant: "destructive" });
      }
      setIsLoading(false); // Crucial: ensure loading state is reset
    }
    // Note: setIsLoading(false) might be better in a finally block if signInWithPopup doesn't guarantee onAuthStateChanged fires immediately on success to set isLoading.
    // However, onAuthStateChanged *should* handle setting isLoading to false after successful login.
    // For errors, we definitely need it in the catch block.
  };

  const signOutUser = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      // onAuthStateChanged will set currentUser to null and isLoading to false
      toast({ title: t.authLogoutSuccessTitle, description: t.authLogoutSuccessDescription });
    } catch (error) {
      console.error("Sign-Out Error:", error);
      toast({ title: t.errorDialogTitle, description: t.authLogoutError, variant: "destructive" });
      setIsLoading(false); // Reset loading state on error
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, signInWithGoogle, signOutUser }}>
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
