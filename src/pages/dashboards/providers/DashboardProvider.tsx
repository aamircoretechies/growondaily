import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuthContext } from "@/auth";
import { useLanguage } from "@/providers/TranslationProvider";

interface DashboardContextType {
  dashboardData: any;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { auth, currentUser } = useAuthContext();
  const { currentLanguage } = useLanguage(); // Get current language to refetch on change

  const fetchDashboardData = useCallback(async () => {
    console.log("Fetching dashboard data...");
    if (!auth?.access_token) return;
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      // const res = await axios.post("https://api.growondaily.com/api/dashboard",
      //   {},
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );
      const res = await axios.post("/api/dashboard",
        {},
        {
          headers: {
            // Authorization: `Bearer ${token}`,
            Authorization: `Bearer ${auth.access_token}`,
          },
        }
      );


      if (res.data.status === 1) {
        setDashboardData(res.data.data);
      } else {
        setError("Failed to fetch dashboard data");
      }
    } catch (err: any) {
      console.error("Dashboard API Error:", err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [auth?.access_token]);

  // useEffect(() => {
  //   fetchDashboardData();
  // }, []);

  //  useEffect(() => {
  //   if (auth?.access_token) {
  //     fetchDashboardData();    
  //   }
  // }, []);

  useEffect(() => {
    if (auth?.access_token && currentUser) {
      fetchDashboardData();
    }
  }, [currentUser, currentLanguage.code, fetchDashboardData]); // Refetch when language changes

  // Listen for verse read updates to refresh progress bar
  useEffect(() => {
    if (!auth?.access_token) return; // Don't set up listener if not authenticated

    const handleVerseUpdate = (event: Event) => {
      console.log("Verse read update detected, refreshing dashboard...", event);
      // Only refresh if we have auth token
      if (auth?.access_token) {
        fetchDashboardData();
      }
    };

    window.addEventListener('verse-read-updated', handleVerseUpdate);

    return () => {
      window.removeEventListener('verse-read-updated', handleVerseUpdate);
    };
  }, [auth?.access_token, fetchDashboardData]); // Re-bind if auth or fetch function changes

  return (
    <DashboardContext.Provider
      value={{ dashboardData, loading, error, refetch: fetchDashboardData }}
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
