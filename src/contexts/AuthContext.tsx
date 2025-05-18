
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase/firebaseConfig';
import { useLanguage } from './LanguageContext';
import { useToast } from "@/hooks/use-toast";

const MOCK_VALID_VOUCHERS = ['HEMAT30', 'CUAN7', 'SETAHUNHEMAT']; // Example valid vouchers
const TRIAL_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const VOUCHER_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean; // Firebase auth loading
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  // Subscription related state
  trialEndsAt: number | null;
  isSubscriptionActive: boolean;
  isLoadingSubscription: boolean;
  activateVoucher: (voucherCode: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Firebase auth loading

  const [trialEndsAt, setTrialEndsAt] = useState<number | null>(null);
  const [isSubscriptionActive, setIsSubscriptionActive] = useState(false);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
  const [usedVouchers, setUsedVouchers] = useState<string[]>([]);

  const { t } = useLanguage();
  const { toast } = useToast();

  const getSubscriptionStorageKey = useCallback((baseKey: string) => {
    return currentUser ? `${baseKey}_${currentUser.uid}` : null;
  }, [currentUser]);

  const loadSubscriptionData = useCallback(() => {
    if (!currentUser) {
      setTrialEndsAt(null);
      setIsSubscriptionActive(false);
      setUsedVouchers([]);
      setIsLoadingSubscription(false);
      return;
    }

    setIsLoadingSubscription(true);
    const trialKey = getSubscriptionStorageKey('trialEndsAt');
    const usedVouchersKey = getSubscriptionStorageKey('usedVouchers');

    const savedTrialEndsAt = trialKey ? localStorage.getItem(trialKey) : null;
    const savedUsedVouchers = usedVouchersKey ? localStorage.getItem(usedVouchersKey) : null;

    let currentTrialEnd = null;
    if (savedTrialEndsAt) {
      currentTrialEnd = parseInt(savedTrialEndsAt, 10);
      setTrialEndsAt(currentTrialEnd);
    }

    if (savedUsedVouchers) {
      setUsedVouchers(JSON.parse(savedUsedVouchers));
    } else {
      setUsedVouchers([]);
    }
    
    // If no trial/subscription info, and user is new (or has no stored info), start trial
    if (!currentTrialEnd && currentUser) { 
      const newTrialEndsAt = Date.now() + TRIAL_DURATION_MS;
      setTrialEndsAt(newTrialEndsAt);
      if (trialKey) localStorage.setItem(trialKey, newTrialEndsAt.toString());
      currentTrialEnd = newTrialEndsAt; // use this for current session's check
    }
    
    checkSubscriptionStatus(currentTrialEnd);
    setIsLoadingSubscription(false);

  }, [currentUser, getSubscriptionStorageKey]);


  const checkSubscriptionStatus = (currentTrialEndOverride?: number | null) => {
    const endTimestamp = currentTrialEndOverride !== undefined ? currentTrialEndOverride : trialEndsAt;
    if (endTimestamp && Date.now() < endTimestamp) {
      setIsSubscriptionActive(true);
    } else {
      setIsSubscriptionActive(false);
    }
  };
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
      if (user) {
        loadSubscriptionData();
      } else {
        // Clear subscription data if user logs out
        setTrialEndsAt(null);
        setIsSubscriptionActive(false);
        setUsedVouchers([]);
        setIsLoadingSubscription(false); 
      }
    });
    return () => unsubscribe();
  }, [loadSubscriptionData]);


  useEffect(() => { // Re-check status if trialEndsAt changes
    checkSubscriptionStatus();
  }, [trialEndsAt]);


  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast({ title: t.authLoginSuccessTitle, description: t.authLoginSuccessDescription });
      // onAuthStateChanged will handle setting currentUser, isLoading, and loading subscription data
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        console.log("Login popup closed or cancelled by user.");
      } else {
        toast({ title: t.errorDialogTitle, description: t.authLoginError, variant: "destructive" });
      }
      setIsLoading(false);
    }
  };

  const signOutUser = async () => {
    setIsLoading(true); // Indicate auth operation
    try {
      await signOut(auth);
      toast({ title: t.authLogoutSuccessTitle, description: t.authLogoutSuccessDescription });
      // onAuthStateChanged will clear currentUser, and subsequently subscription data
    } catch (error) {
      console.error("Sign-Out Error:", error);
      toast({ title: t.errorDialogTitle, description: t.authLogoutError, variant: "destructive" });
      setIsLoading(false);
    }
  };

  const activateVoucher = async (voucherCode: string): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) {
      return { success: false, message: t.authRequiredDescription };
    }
    if (usedVouchers.includes(voucherCode)) {
      return { success: false, message: t.voucherUsedError };
    }
    if (MOCK_VALID_VOUCHERS.includes(voucherCode.toUpperCase())) {
      const newExpiry = Math.max(Date.now(), trialEndsAt || Date.now()) + VOUCHER_DURATION_MS;
      setTrialEndsAt(newExpiry);
      
      const trialKey = getSubscriptionStorageKey('trialEndsAt');
      if (trialKey) localStorage.setItem(trialKey, newExpiry.toString());

      const updatedUsedVouchers = [...usedVouchers, voucherCode];
      setUsedVouchers(updatedUsedVouchers);
      const usedVouchersKey = getSubscriptionStorageKey('usedVouchers');
      if (usedVouchersKey) localStorage.setItem(usedVouchersKey, JSON.stringify(updatedUsedVouchers));

      setIsSubscriptionActive(true);
      return { success: true, message: t.voucherSuccess(new Date(newExpiry).toLocaleDateString(t.languageCodeForDate)) };
    }
    return { success: false, message: t.voucherInvalidError };
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isLoading, 
      signInWithGoogle, 
      signOutUser,
      trialEndsAt,
      isSubscriptionActive,
      isLoadingSubscription,
      activateVoucher
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
