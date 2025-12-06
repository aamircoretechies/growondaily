import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuthContext } from "@/auth";
import { useLanguage } from "@/providers/TranslationProvider";

interface DashboardContextType {
  dashboardData: any;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  isLoaded: boolean; // Flag to indicate dashboard data has been loaded
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false); // Track if dashboard has been loaded

  const { auth, currentUser } = useAuthContext();
  const { currentLanguage } = useLanguage(); // Get current language to refetch on change
  const didFetch = React.useRef(false);


  // const fetchDashboardData = useCallback(async () => {
  //   console.log("Fetching dashboard data...");
  //   if (!auth?.access_token) return;
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     const token = localStorage.getItem("token");
  //     const res = await axios.post("/api/dashboard",
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${auth.access_token}`,
  //         },
  //       }
  //     );


  //     if (res.data.status === 1) {
  //       setDashboardData(res.data.data);
  //     } else {
  //       setError("Failed to fetch dashboard data");
  //     }
  //   } catch (err: any) {
  //     console.error("Dashboard API Error:", err);
  //     setError("Something went wrong");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [auth?.access_token]);



  // useEffect(() => {
  //   fetchDashboardData();
  // }, []);

  //  useEffect(() => {
  //   if (auth?.access_token) {
  //     fetchDashboardData();    
  //   }
  // }, []);

  // useEffect(() => {
  //   if (auth?.access_token && currentUser) {
  //     fetchDashboardData();
  //   }
  // }, [currentUser, currentLanguage.code, fetchDashboardData]); 

  /* 
     FIX: We only check for auth.access_token. We do NOT want to depend on 'currentUser'.
     Why? Because 'currentUser' updates on every keystroke in ProfileSetupModal (for real-time sync).
     If we depend on it, we re-fetch dashboard data 10 times a second while typing, causing blinking.
  */
  const fetchDashboardData = useCallback(async () => {
    if (!auth?.access_token) return;

    try {
      setLoading(true);
      setError(null);
      const res = await axios.post("/api/dashboard", {}, {
        headers: { Authorization: `Bearer ${auth.access_token}` }
      });

      if (res.data.status === 1) {
        setDashboardData(res.data.data);
        setIsLoaded(true); // Mark dashboard as loaded
      } else {
        setError("Failed to fetch dashboard data");
        setIsLoaded(false);
      }

    } catch (err) {
      setError("Something went wrong");
      setIsLoaded(false);
    } finally {
      setLoading(false);
    }

  }, [auth?.access_token]);



  useEffect(() => {
    if (!auth?.access_token) {
      setIsLoaded(false);
      didFetch.current = false; // Reset when auth/user is missing
      return;
    }

    // Prevent double API calls (StrictMode fix)
    // if (didFetch.current) return;

    // didFetch.current = true;
    fetchDashboardData();

  }, [auth?.access_token, currentLanguage.code, fetchDashboardData]);




  return (
    <DashboardContext.Provider
      value={{ dashboardData, loading, error, refetch: fetchDashboardData, isLoaded }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
