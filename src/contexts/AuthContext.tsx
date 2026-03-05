import React, { createContext, useContext, useEffect, useState } from 'react';
import { validateLicense, LicenseData } from '../lib/api';

interface AuthContextType {
  license: LicenseData | null;
  licenseKey: string | null;
  isLoading: boolean;
  login: (key: string) => Promise<boolean>;
  logout: () => void;
  canManageContent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [license, setLicense] = useState<LicenseData | null>(null);
  const [licenseKey, setLicenseKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('licenseKey');
    if (stored) {
      performValidation(stored);
    } else {
      setIsLoading(false);
    }
  }, []);

  const performValidation = async (key: string) => {
    try {
      // Owner Master Key bypass for Admin Panel
      if (key === "owner-master-key-2026") {
        setLicense({
          status: "active",
          username: "Owner",
          expiry: "2099-01-01",
          hwid: "MASTER",
          version: "LATEST"
        });
        setLicenseKey(key);
        return true;
      }

      const data = await validateLicense(key);
      if (data.status === "success" || data.status === "active") {
        setLicense(data);
        setLicenseKey(key);
        return true;
      }

      setLicense(null);
      localStorage.removeItem('licenseKey');
      return false;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (key: string): Promise<boolean> => {
    setIsLoading(true);
    const success = await performValidation(key);
    if (success) {
      localStorage.setItem('licenseKey', key);
    }
    setIsLoading(false);
    return success;
  };

  const logout = () => {
    setLicense(null);
    setLicenseKey(null);
    localStorage.removeItem('licenseKey');
  };

  // Admin/Owner check for Admin Panel access
  const canManageContent = licenseKey === "owner-master-key-2026" || license?.status === "admin";

  return (
    <AuthContext.Provider
      value={{
        license,
        licenseKey,
        isLoading,
        login,
        logout,
        canManageContent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
