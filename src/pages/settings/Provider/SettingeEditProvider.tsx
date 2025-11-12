import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const SettingEditContext = createContext<any>(null);

export const SettingEditProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Get user details (initially from localStorage or backend)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Function to update profile
  const updateProfile = async (updatedData: { first_name: string; last_name: string; email: string }) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await axios.put("https://api.growondaily.com/api/auth/profile",
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === 1) {
        const updatedUser = response.data.data.user;
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser)); // keep it synced
        return { success: true, message: "Profile updated successfully" };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      return { success: false, message: error.response?.data?.message || "Something went wrong" };
    } finally {
      setLoading(false);
    }
  };

    // Function to change password
  const changePassword = async (passwordData: { current_password: string; new_password: string; confirm_password: string }) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      const response = await axios.put("https://api.growondaily.com/api/auth/change-password",
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === 1) {
        return { success: true, message: "Password changed successfully" };
      } else {
        return { success: false, message: response.data.message || "Failed to change password" };
      }
    } catch (error: any) {
      console.error("Error changing password:", error);
      return { success: false, message: error.response?.data?.message || "Something went wrong" };
    } finally {
      setLoading(false);
    }
  };


    // Function to get notification preferences
  const getNotificationPreferences = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      const response = await axios.get("https://api.growondaily.com/api/notifications/preferences",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === 1) {
        return {
          success: true,
          data: response.data.data,
          message: "Notification preferences retrieved successfully",
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Failed to fetch preferences",
        };
      }
    } catch (error: any) {
      console.error("Error fetching notification preferences:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Something went wrong",
      };
    } finally {
      setLoading(false);
    }
  };


   const updateNotificationPreferences = async (preferences: { email_notification: boolean; push_notification: boolean }) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await axios.put("https://api.growondaily.com/api/notifications/preferences",
        preferences,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === 1) {
        return { success: true, message: "Notification preferences updated successfully" };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      console.error("Error updating notification preferences:", error);
      return { success: false, message: error.response?.data?.message || "Something went wrong" };
    } finally {
      setLoading(false);
    }
  };


  return (
    <SettingEditContext.Provider value={{ user, loading, updateProfile,changePassword,getNotificationPreferences,updateNotificationPreferences,  }}>
      {children}
    </SettingEditContext.Provider>
  );
};

// Custom Hook
export const useSettingEdit = () => useContext(SettingEditContext);
