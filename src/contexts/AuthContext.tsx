
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase/firebaseConfig';
import { useLanguage } from './LanguageContext';
import { useToast } from "@/hooks/use-toast";

// const MOCK_VALID_VOUCHERS = ['HEMAT30', 'CUAN7', 'SETAHUNHEMAT']; // Example valid vouchers - Replaced by Apps Script
const TRIAL_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
// const VOUCHER_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // Duration now comes from Apps Script

// IMPORTANT: Replace this with your actual Google Apps Script Web App URL
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzN-22M_ng1cx8n7BKAa-sPDFdYAuvrNIDpVcKnm2VaH_zTawuB4cj-Img3g9zJsxJZZw/exec';


interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean; // Firebase auth loading
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
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
  const [usedVouchers, setUsedVouchers] = useState<string[]>([]); // Still useful to prevent re-submitting same voucher in same session if API fails temporarily

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
    // const usedVouchersKey = getSubscriptionStorageKey('usedVouchers'); // usedVouchers from Apps Script is the source of truth now for *successful* uses

    const savedTrialEndsAt = trialKey ? localStorage.getItem(trialKey) : null;
    // const savedUsedVouchers = usedVouchersKey ? localStorage.getItem(usedVouchersKey) : null; // Not strictly needed for validation anymore

    let currentTrialEnd = null;
    if (savedTrialEndsAt) {
      currentTrialEnd = parseInt(savedTrialEndsAt, 10);
      setTrialEndsAt(currentTrialEnd);
    }

    // if (savedUsedVouchers) { // Not strictly needed
    //   setUsedVouchers(JSON.parse(savedUsedVouchers));
    // } else {
    //   setUsedVouchers([]);
    // }
    
    if (!currentTrialEnd && currentUser) { 
      const newTrialEndsAt = Date.now() + TRIAL_DURATION_MS;
      setTrialEndsAt(newTrialEndsAt);
      if (trialKey) localStorage.setItem(trialKey, newTrialEndsAt.toString());
      currentTrialEnd = newTrialEndsAt; 
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
        setTrialEndsAt(null);
        setIsSubscriptionActive(false);
        setUsedVouchers([]);
        setIsLoadingSubscription(false); 
      }
    });
    return () => unsubscribe();
  }, [loadSubscriptionData]);


  useEffect(() => { 
    checkSubscriptionStatus();
  }, [trialEndsAt]);


  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast({ title: t.authLoginSuccessTitle, description: t.authLoginSuccessDescription });
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        console.log("Login popup closed or cancelled by user.");
        // No toast for user cancellation
      } else {
        toast({ title: t.errorDialogTitle, description: t.authLoginError, variant: "destructive" });
      }
      setIsLoading(false); // Ensure loading is false on error if onAuthStateChanged doesn't fire or fires with null
    }
  };

  const signOutUser = async () => {
    setIsLoading(true); 
    try {
      await signOut(auth);
      toast({ title: t.authLogoutSuccessTitle, description: t.authLogoutSuccessDescription });
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
    // Client-side check for already used in *this session* to prevent quick re-submissions
    // The Apps Script is the source of truth for actual voucher usage.
    // if (usedVouchers.includes(voucherCode)) { 
    //   return { success: false, message: t.voucherUsedError };
    // }

    try {
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        // redirect: 'follow', // Apps Script Web Apps often handle redirects for auth, but for simple POST, not usually needed.
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voucherCode: voucherCode, userId: currentUser.uid }),
      });

      if (!response.ok) {
        // This catches network errors or non-2xx HTTP statuses before trying to parse JSON
        const errorText = await response.text();
        console.error("Apps Script API Error (HTTP):", response.status, errorText);
        return { success: false, message: `Error: ${response.status}. ${errorText || t.voucherErrorGeneral }`};
      }
      
      const result = await response.json();

      if (result.success) {
        const VOUCHER_DURATION_MS = (result.duration_days || 30) * 24 * 60 * 60 * 1000; // Default to 30 days if not provided
        const newExpiry = Math.max(Date.now(), trialEndsAt || Date.now()) + VOUCHER_DURATION_MS;
        setTrialEndsAt(newExpiry);
        
        const trialKey = getSubscriptionStorageKey('trialEndsAt');
        if (trialKey) localStorage.setItem(trialKey, newExpiry.toString());

        // const updatedUsedVouchers = [...usedVouchers, voucherCode]; // Not strictly needed if Apps Script is source of truth
        // setUsedVouchers(updatedUsedVouchers);
        // const usedVouchersKey = getSubscriptionStorageKey('usedVouchers');
        // if (usedVouchersKey) localStorage.setItem(usedVouchersKey, JSON.stringify(updatedUsedVouchers));

        setIsSubscriptionActive(true);
        return { success: true, message: result.message || t.voucherSuccess(new Date(newExpiry).toLocaleDateString(t.languageCodeForDate)) };
      } else {
        return { success: false, message: result.message || t.voucherInvalidError };
      }
    } catch (error) {
      console.error("Error activating voucher:", error);
      return { success: false, message: t.voucherErrorNetwork };
    }
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
