import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

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

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token"); 
      const res = await axios.post("https://api.growondaily.com/api/dashboard",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
