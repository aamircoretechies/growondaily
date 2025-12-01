import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from '@/providers/TranslationProvider';
import { I18N_LANGUAGES, I18N_CONFIG_KEY } from '@/i18n';
import { setData } from '@/utils';


const SettingEditContext = createContext<any>(null);

export const SettingEditProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [languageLoading, setLanguageLoading] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);

  const { changeLanguage } = useLanguage();

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
      // setLoading(true);
      setProfileLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await axios.put("/api/auth/profile",
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });


      if (response.data.status === 1) {
        const updatedUser = response.data.data.user;
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return { success: true, message: "Profile updated successfully" };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      return { success: false, message: error.response?.data?.message || "Something went wrong" };
    } finally {
      setProfileLoading(false);
    }
  };

  const changePassword = async (passwordData: { current_password: string; new_password: string; confirm_password: string }) => {
    try {
      // setLoading(true);
      setPasswordLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await axios.put("/api/auth/change-password", passwordData, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } });
      if (response.data.status === 1) {
        return { success: true, message: "Password changed successfully" };
      } else {
        return { success: false, message: response.data.message || "Failed to change password" };
      }
    } catch (error: any) {
      console.error("Error changing password:", error);
      return { success: false, message: error.response?.data?.message || "Something went wrong" };
    } finally {
      // setLoading(false);
      setPasswordLoading(false);
    }
  };

  const getNotificationPreferences = async () => {
    try {
      // setLoading(true);
      setNotificationLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("/api/notifications/preferences", { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } });

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
      // setLoading(false);
      setNotificationLoading(false);
    }
  };


  const updateNotificationPreferences = async (preferences: { email_notification: boolean; push_notification: boolean }) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await axios.put("/api/notifications/preferences", preferences, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } });


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

  // const selectLanguage = async (language_code: string) => {
  //   try {
  //     // setLoading(true);
  //     setLanguageLoading(true);
  //     const token = localStorage.getItem("accessToken");

  //     const response = await axios.post("/api/auth/select-language", { language_code }, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } });


  //     if (response.data.status === 1) {
  //       const updatedUser = { ...user, language_code };
  //       setUser(updatedUser);
  //       localStorage.setItem("user", JSON.stringify(updatedUser));

  //       const selectedLang = I18N_LANGUAGES.find((l) => l.code === language_code);
  //       if (selectedLang) {
  //         setData(I18N_CONFIG_KEY, selectedLang); // persist
  //         changeLanguage(selectedLang); // update context immediately
  //       }

  //       return { success: true, message: response.data.message || "Language selected successfully" };
  //     } else {
  //       return { success: false, message: response.data.message || "Failed to select language" };
  //     }
  //   } catch (error: any) {
  //     console.error("Error selecting language:", error);
  //     return { success: false, message: error.response?.data?.message || "Something went wrong" };
  //   } finally {
  //     // setLoading(false);
  //     setLanguageLoading(false);
  //   }
  // };

  const changeLanguageBackend = async (language_code: string) => {
  try {
    setLanguageLoading(true);
    const token = localStorage.getItem("accessToken");

    const response = await axios.post("/api/auth/change-language",
      { language_code },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (response.data.status === 1) {

      // Update user object
      const updatedUser = { ...user, language_code };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update frontend language
      const selectedLang = I18N_LANGUAGES.find((x) => x.code === language_code);
      if (selectedLang) {
        setData(I18N_CONFIG_KEY, selectedLang);
        changeLanguage(selectedLang);
      }

      return { success: true, message: "Language changed successfully" };
    }

    return { success: false, message: response.data.message };

  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong"
    };
  } finally {
    setLanguageLoading(false);
  }
};


  const deleteAccount = async () => {
  try {
    const token = localStorage.getItem("accessToken");

    const response = await axios.delete("/api/auth/delete-account", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: {
        confirmation_code: "DELETE_MY_ACCOUNT"
      }
    });

    console.log("DELETE RESPONSE =>", response.data); 

    if (response.data.status === 1) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      return { success: true };
    }

    return { success: false, message: response.data.message, errors: response.data.errors };

  } catch (error: any) {
    const errorData = error?.response?.data;
    console.log("DELETE ERROR =>", errorData);
    if (errorData?.errors) {
      console.log("Validation errors:", errorData.errors);
      errorData.errors.forEach((err: any, index: number) => {
        console.log(`Error ${index + 1}:`, err);
      });
    }
    return { 
      success: false, 
      message: errorData?.message || "Failed to delete account",
      errors: errorData?.errors || []
    };
  }
};



  return (
    <SettingEditContext.Provider value={{ user, loading, profileLoading, passwordLoading, notificationLoading, updateProfile, languageLoading, changePassword, getNotificationPreferences, updateNotificationPreferences,deleteAccount,changeLanguageBackend,  }}>
      {children}
    </SettingEditContext.Provider>
  );
};

// Custom Hook
export const useSettingEdit = () => useContext(SettingEditContext);
