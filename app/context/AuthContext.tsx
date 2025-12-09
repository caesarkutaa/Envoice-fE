// contexts/AuthContext.tsx
"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { setCookie, getCookie, deleteAllAuthCookies } from "../utils/cookies";
import { refreshAccessToken, isTokenExpired } from "../utils/tokenRefresh";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
  setAuth: (accessToken: string, refreshToken: string, user?: any) => void;
  clearAuth: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore auth from cookies on mount
  useEffect(() => {
 
    
    const restoreAuth = async () => {
      try {
        const storedAccessToken = getCookie("accessToken");
        const storedRefreshToken = getCookie("refreshToken");
        const storedUser = getCookie("user");

        

        if (storedAccessToken && storedRefreshToken) {
          // Check if access token is expired
          if (isTokenExpired(storedAccessToken)) {
            console.log("Access token is expired, attempting refresh...");
            
            // Try to refresh the token
            const newTokens = await refreshAccessToken(storedRefreshToken);
            
            if (newTokens) {
              console.log("Token refreshed successfully");
              setAccessToken(newTokens.accessToken);
              setRefreshToken(newTokens.refreshToken);
              
              // Update cookies with new tokens
              setCookie("accessToken", newTokens.accessToken, 7);
              setCookie("refreshToken", newTokens.refreshToken, 7);
              
              if (storedUser) {
                try {
                  setUser(JSON.parse(decodeURIComponent(storedUser)));
                } catch (e) {
                  console.error("Error parsing user cookie:", e);
                }
              }
            } else {
              console.log("Token refresh failed, clearing auth");
              deleteAllAuthCookies();
            }
          } else {
            // Token is still valid
            console.log("Access token is still valid");
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
            
            if (storedUser) {
              try {
                setUser(JSON.parse(decodeURIComponent(storedUser)));
              } catch (e) {
                console.error("Error parsing user cookie:", e);
              }
            }
          }
          
          console.log("Auth restored successfully");
        } else {
          console.log("No valid auth cookies found");
        }
      } catch (error) {
        console.error("Error restoring auth from cookies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    restoreAuth();
  }, []);

  const setAuth = (access: string, refresh: string, userData?: any) => {
    console.log("Setting auth...", { hasUserData: !!userData });
    
    setAccessToken(access);
    setRefreshToken(refresh);
    if (userData) setUser(userData);

    // Persist to cookies (7 days expiry)
    setCookie("accessToken", access, 7);
    setCookie("refreshToken", refresh, 7);
    if (userData) {
      setCookie("user", encodeURIComponent(JSON.stringify(userData)), 7);
    }
    
    console.log("Auth set successfully");
  };

  const clearAuth = () => {
    console.log("Clearing auth...");
    
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);

    // Clear cookies
    deleteAllAuthCookies();
    
    console.log("Auth cleared");
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, user, setAuth, clearAuth, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}