/* eslint-disable no-unused-vars */
import axios, { AxiosResponse } from 'axios';
import { createContext, type Dispatch, type PropsWithChildren, type SetStateAction, useEffect, useState } from 'react';

import * as authHelper from '../_helpers';
import { type AuthModel, type UserModel } from '@/auth';

// const API_URL = import.meta.env.VITE_APP_API_URL;
export const LOGIN_URL = `/api/auth/login`;
export const REGISTER_URL = `/api/auth/create-account`;
export const FORGOT_PASSWORD_URL = `/api/auth/forgot-password`;
export const RESET_PASSWORD_URL = `/api/auth/reset-password`;
export const GET_USER_URL = `/api/auth/profile`;
export const VERIFY_RESET_TOKEN_URL = `/api/auth/verify-reset-token`;



import { signInWithPopup } from "firebase/auth";
import { auth as firebaseAuth, googleProvider } from "@/firebaseConfig";

interface AuthContextProps {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  auth: AuthModel | undefined;
  saveAuth: (auth: AuthModel | undefined) => void;
  currentUser: UserModel | undefined;
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle?: () => Promise<boolean>;
  loginWithFacebook?: () => Promise<void>;
  loginWithGithub?: () => Promise<void>;
  register: (email: string, password: string, password_confirmation: string) => Promise<{ success: boolean; data?: any }>;
  requestPasswordResetLink: (email: string) => Promise<any>;
  changePassword: (
    token: string,
    password: string,
    password_confirmation: string
  ) => Promise<void>;
  getUser: (tokenFromLogin?: string) => Promise<UserModel>;
  saveUserPreferences: (preferencesData: any) => Promise<UserModel>;
  updateUserPreferences: (preferencesData: any) => Promise<UserModel>;
  saveOrUpdateUserPreferences: (preferencesData: any) => Promise<UserModel | null>;
  logout: () => void;
  verify: () => Promise<void>;
  profileProgress: number;
  setProfileProgress: Dispatch<SetStateAction<number>>;
  refreshDashboard: () => Promise<void>;
  updateProfileImage: (file: File) => Promise<UserModel | null>;

  changeLanguage: (langCode: string) => Promise<any>;
  verifyResetToken: (token: string) => Promise<any>;


}

// const AuthContext = createContext<AuthContextProps | null>(null);
const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);


const AuthProvider = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth());
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>();
  const [profileProgress, setProfileProgress] = useState(Number(localStorage.getItem("profileProgress") || 0));

  const refreshDashboard = async () => {
    try {
      const updated = await getUser();
      if (updated) {
        setCurrentUser(updated);
      }
    } catch (err) {
      console.error("Failed to refresh dashboard", err);
    }
  };


  useEffect(() => {
    try {
      localStorage.setItem("profileProgress", String(profileProgress));
    } catch (err) {
    }
  }, [profileProgress]);


  const verify = async () => {
    if (auth) {
      try {
        const user = await getUser();
        setCurrentUser(user);
      } catch {
        saveAuth(undefined);
        setCurrentUser(undefined);
      }
    }
  };

  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth);
    if (auth) {
      authHelper.setAuth(auth);
    } else {
      authHelper.removeAuth();
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        if (auth) {
          await verify();
        }
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);



  // const login = async (email: string, password: string) => {
  //   try {
  //     const response = await axios.post(
  //       LOGIN_URL,
  //       { email, password },
  //       { withCredentials: true }
  //     );

  //     const authData = response.data.data;
  //     if (!authData?.token) throw new Error("Please Enter Valid email or password");

  //     const authObj: AuthModel = {
  //       access_token: authData.token,
  //       api_token: authData.token,
  //       refreshToken: undefined
  //     };

  //     saveAuth(authObj);

  //   } catch (error: any) {
  //     console.error("LOGIN ERROR:", error);
  //     saveAuth(undefined);
  //     if (
  //       error?.response?.status === 502 ||
  //       error?.response?.status === 503 ||
  //       error?.response?.status === 504
  //     ) {
  //       throw new Error("Please wait… establishing a secure connection.");
  //     }

  //     if (error.message === "Network Error") {
  //       throw new Error("Please wait… establishing a secure connection.");
  //     }

  //     let msg =
  //       error?.response?.data?.message ||
  //       error?.message ||
  //       "Invalid email or password";

  //     throw new Error(msg);
  //   }
  // };


  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        LOGIN_URL,
        { email, password },
        { withCredentials: true }
      );

      const responseData = response.data;
      if (responseData?.status === 0) {
        throw new Error(responseData.message || "Login failed");
      }
      const authData = responseData.data;
      if (!authData?.token) {
        throw new Error("Invalid login response from server");
      }

      const authObj: AuthModel = {
        access_token: authData.token,
        api_token: authData.token,
        refreshToken: undefined,
      };

      saveAuth(authObj);
    } catch (error: any) {
      console.error("LOGIN ERROR:", error);
      saveAuth(undefined);

      if (
        error?.response?.status === 502 ||
        error?.response?.status === 503 ||
        error?.response?.status === 504 ||
        error?.message === "Network Error"
      ) {
        throw new Error("Please wait… establishing a secure connection.");
      }

      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Invalid email or password";

      throw new Error(msg);
    }
  };



  const register = async (email: string, password: string, password_confirmation: string) => {
    try {
      const { data: auth } = await axios.post(REGISTER_URL, {
        email,
        password,
        re_password: password_confirmation,
      });

      if (auth?.success || auth?.message?.toLowerCase().includes("success")) {
        return { success: true, data: auth };
      }

      return { success: false, data: auth };
    } catch (error: any) {
      saveAuth(undefined);
      console.error("REGISTER ERROR:", error.response?.data || error.message);

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message || "Registration failed. Please try again.");
      }
    }
  };

  const requestPasswordResetLink = async (email: string) => {
    try {
      const response = await axios.post(FORGOT_PASSWORD_URL, { email });
      return response.data;
    } catch (error: any) {
      console.error("Forgot password API error:", error.response?.data || error.message);
      throw error;
    }
  };

  // const changePassword = async (
  //   email: string,
  //   token: string,
  //   password: string,
  //   password_confirmation: string
  // ) => {
  //   await axios.post(RESET_PASSWORD_URL, {
  //     email,
  //     token,
  //     password,
  //     password_confirmation
  //   });
  // };

  const changePassword = async (
    token: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<void> => {


    const response = await axios.post(
      RESET_PASSWORD_URL,
      {
        token: token,
        new_password: newPassword,
        confirm_password: confirmPassword
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  };


  const getUser = async (tokenFromLogin?: string): Promise<UserModel> => {
    const token = tokenFromLogin || auth?.access_token || auth?.api_token;
    if (!token) throw new Error("No token found");

    try {
      const response = await axios.get(GET_USER_URL, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: false,
      });

      const apiUser = response.data?.data?.user as UserModel;
      const apiPreferences = response.data?.data?.preferences;
      const fullUser = { ...apiUser, preferences: apiPreferences } as UserModel;

      console.log("full user", fullUser);

      // FIX: Prefer step-based progress from localStorage if available, 
      // otherwise fall back to field-based calculation.
      // FIX: Prefer step-based progress from localStorage or check if setup is fully done.
      // We DO NOT calculate based on fields anymore as that causes "settings" updates to affect "setup" progress.
      // FIX: Profile progress should ONLY be controlled by ProfileSetupModal via localStorage
      // Do NOT automatically set to 100 based on is_preference_setup_done
      // is_preference_setup_done can become true after first language change,
      // but this should NOT affect the Profile Setup card visibility
      const savedProgress = localStorage.getItem("profileProgress");

      if (savedProgress) {
        setProfileProgress(Number(savedProgress));
      } else {
        // Default to 0 if nothing is saved
        // Only ProfileSetupModal should update this to 100
        setProfileProgress(0);
      }

      try {
        localStorage.setItem("growondaily_currentUser", JSON.stringify(fullUser));
      } catch (err) {
      }

      return fullUser;
    } catch (error: any) {
      console.error("PROFILE ERROR:", error.response?.data || error);
      throw error;
    }
  };

  // Save preferences (first-time POST)
  const saveUserPreferences = async (preferencesData: any): Promise<UserModel> => {
    let token = auth?.access_token || auth?.api_token || authHelper.getAuth()?.access_token || authHelper.getAuth()?.api_token || "";
    await axios.put(`/api/auth/profile`,
      {
        first_name: preferencesData?.firstName,
        last_name: preferencesData?.lastName,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!token) throw new Error("No auth token found. Please login first.");

    try {
      const toBackendEnum = (value: string) =>
        (value || '')
          .trim()
          .toUpperCase()
          .replace(/[^A-Z0-9]+/g, '_')
          .replace(/^_|_$/g, '');

      const experienceMap: Record<string, string> = {
        'FIRST TIME': 'FIRST_TIME',
        'OCCASIONAL': 'OCCASIONAL',
        'REGULAR': 'REGULAR',
        'THEOLOGICAL': 'THEOLOGICAL',
      };

      const payloadPreferences = {
        language_code: authHelper.getCurrentLanguage().code || 'en',
        bible_version: (preferencesData?.translations?.[0]?.split(' - ')[0] || 'KJV').toUpperCase(),
        depth_level: preferencesData?.depth?.includes('Short')
          ? 'short'
          : preferencesData?.depth?.includes('Medium')
            ? 'medium'
            : 'deep',
        experience_with_bible: [
          experienceMap[(preferencesData?.experience || '').toString().toUpperCase()] ||
          toBackendEnum(preferencesData?.experience || 'First Time'),
        ],
        what_brings_you: Array.isArray(preferencesData?.brings)
          ? preferencesData.brings.join(', ')
          : preferencesData?.brings || '',
        engagement_preference: Array.isArray(preferencesData?.engage)
          ? preferencesData.engage.map((e: string) => toBackendEnum(e))
          : preferencesData?.engage
            ? [toBackendEnum(preferencesData.engage)]
            : [],
        explanation_style: (preferencesData?.explainStyle || '').toLowerCase().includes('simple')
          ? 'simple'
          : (preferencesData?.explainStyle || '').toLowerCase().includes('deeper')
            ? 'balanced'
            : 'balanced',
        receive_daily: preferencesData?.dailyPref === 'Daily',
        historical_context: true,
        ground_text_analysis: true,
        special_insights: true,
        daily_life_application: true,
        cross_reference: true,
        commentary_insights: true,
        key_takeaways: true,
        reflection_prompts: true,
      };

      await axios.post(`/api/auth/preferences`,
        { preferences: payloadPreferences },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: false,
        }
      );

      // fetch refreshed user and update context
      const updatedUser = await getUser(token);
      setCurrentUser(updatedUser);
      // setProfileProgress(calculateProfileProgress(updatedUser)); // REMOVED: Do not auto-update progress on save
      try {
        localStorage.setItem("growondaily_currentUser", JSON.stringify(updatedUser));
      } catch (err) { }

      return updatedUser;
    } catch (error: any) {
      console.error(" Preferences API Error:", error.response?.data || error.message);
      throw error;
    }
  };

  const updateUserPreferences = async (preferencesData: any): Promise<UserModel> => {
    let token =
      auth?.access_token ||
      auth?.api_token ||
      authHelper.getAuth()?.access_token ||
      authHelper.getAuth()?.api_token ||
      "";

    if (!token) throw new Error("No auth token found. Please login first.");

    try {
      await axios.put(`/api/auth/profile`,
        {
          first_name: preferencesData?.firstName !== undefined ? preferencesData.firstName : currentUser?.first_name,
          last_name: preferencesData?.lastName !== undefined ? preferencesData.lastName : currentUser?.last_name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const toBackendEnum = (value: string) =>
        (value || "")
          .trim()
          .toUpperCase()
          .replace(/[^A-Z0-9]+/g, "_")
          .replace(/^_|_$/g, "");

      const experienceMap: Record<string, string> = {
        FIRST_TIME: "NEW_TO_BIBLE",
        OCCASIONAL: "SOME_KNOWLEDGE",
        REGULAR: "REGULAR_STUDY",
        THEOLOGICAL: "ADVANCED_THEOLOGY",
      };

      const explanationStyle = preferencesData?.explainStyle || preferencesData?.explain || "";

      const payloadPreferences = {
        language_code: authHelper.getCurrentLanguage().code || "en",
        bible_version:
          (preferencesData?.translations?.[0]?.split(" - ")[0] || "").toUpperCase(),
        depth_level: preferencesData?.depth?.includes("Short")
          ? "short"
          : preferencesData?.depth?.includes("Medium")
            ? "medium"
            : preferencesData?.depth
              ? "deep"
              : "",
        experience_with_bible: preferencesData?.experience ? [
          experienceMap[(preferencesData?.experience || "").toUpperCase()] ||
          toBackendEnum(preferencesData?.experience)
        ] : [],
        what_brings_you: Array.isArray(preferencesData?.brings)
          ? preferencesData.brings.join(", ")
          : preferencesData?.brings || "",
        engagement_preference: Array.isArray(preferencesData?.engage)
          ? preferencesData.engage.map((e: string) => toBackendEnum(e))
          : preferencesData?.engage
            ? [toBackendEnum(preferencesData.engage)]
            : [],
        explanation_style:
          explanationStyle.toLowerCase().includes("simple")
            ? "simple"
            : explanationStyle.toLowerCase().includes("deeper")
              ? "balanced"
              : explanationStyle
                ? "balanced"
                : "",
        receive_daily: preferencesData?.dailyPref === "Daily",
        historical_context: true,
        ground_text_analysis: true,
        special_insights: true,
        daily_life_application: true,
        cross_reference: true,
        commentary_insights: true,
        key_takeaways: true,
        reflection_prompts: true,
      };

      await axios.put(`/api/auth/preferences`,
        { preferences: payloadPreferences },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // const refreshedUser = await getUser(token);
      // setCurrentUser(refreshedUser);

      let refreshedUser = await getUser(token);
      refreshedUser = {
        ...refreshedUser,
        first_name: preferencesData?.firstName !== undefined ? preferencesData.firstName : refreshedUser.first_name,
        last_name: preferencesData?.lastName !== undefined ? preferencesData.lastName : refreshedUser.last_name,
      };

      setCurrentUser(refreshedUser);
      localStorage.setItem("growondaily_currentUser", JSON.stringify(refreshedUser));

      // setProfileProgress(calculateProfileProgress(refreshedUser)); // REMOVED: Do not auto-update progress on save
      try {
        localStorage.setItem("growondaily_currentUser", JSON.stringify(refreshedUser));
      } catch (err) { }

      return refreshedUser;
    } catch (error: any) {
      console.error("Update preferences error:", error.response?.data || error.message);
      throw error;
    }
  };

  const saveOrUpdateUserPreferences = async (preferencesData: any): Promise<UserModel | null> => {
    if (currentUser?.is_preference_setup_done) {
      return await updateUserPreferences(preferencesData);
    }
    return await saveUserPreferences(preferencesData);
  };


  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      console.log(" Starting Google login...");

      const result = await signInWithPopup(firebaseAuth, googleProvider);
      console.log(" Firebase popup result:", result);

      const user = result.user;
      console.log(" Logged in Firebase user:", user);

      if (!user.uid || !user.email) {
        throw new Error("Firebase authentication incomplete: missing UID or email");
      }

      const firebaseToken = await user.getIdToken();
      console.log(" Firebase ID token:", firebaseToken);

      console.log(" Sending ID token to backend...");
      const payload = {
        id_token: firebaseToken,
        firebase_uid: user.uid,
        uid: user.uid,
        email: user.email,
      };
      console.log("Payload being sent:", payload);

      const response = await axios.post(`/api/auth/google-login`,
        payload,
        { withCredentials: false }
      );

      console.log(" Full backend response:", response);
      console.log(" response.data:", response.data);

      if (response.data?.status === 0) {
        const errorMessage = response.data?.message || "Backend authentication failed";
        console.error(" Backend error:", errorMessage);
        throw new Error(errorMessage);
      }

      const responseData = response.data?.data;
      console.log("response.data.data (parsed object):", responseData);

      if (!responseData || !responseData.token || !responseData.user) {
        console.error("Invalid response structure from backend", response.data);
        throw new Error(response.data?.message || "Invalid response structure from backend");
      }

      const token = responseData.token;
      console.log(" Token from backend:", token);

      const authData: AuthModel = {
        access_token: token,
        api_token: token,
        refreshToken: undefined,
      };
      saveAuth(authData);
      console.log("Auth saved:", authData);

      const userProfile: UserModel = responseData.user;
      setCurrentUser(userProfile);
      // const progress = calculateProfileProgress(userProfile); // REMOVED
      // setProfileProgress(progress); // REMOVED
      console.log(" User profile set:", userProfile);

      try {
        const fullUser = await getUser(token);
        setCurrentUser(fullUser);
        // setProfileProgress(calculateProfileProgress(fullUser)); // REMOVED
      } catch (err) {
        console.warn("Could not fetch full user profile, using data from login response");
      }

      console.log(" Google login successful!");
      return true;
    } catch (error: any) {
      // Handle Firebase popup errors specifically
      if (error.code === "auth/popup-closed-by-user") {
        console.warn(" Popup closed by user");
        return false;
      }
      if (error.code === "auth/cancelled-popup-request") {
        console.warn(" Cancelled popup request");
        return false;
      }

      console.error(" Google Login Error caught:", error);
      saveAuth(undefined);
      setCurrentUser(undefined);
      throw error;
    }
  };


  // const updateProfileImage = async (file: File): Promise<UserModel | null> => {
  //   try {
  //     const token =
  //       auth?.access_token ||
  //       auth?.api_token ||
  //       authHelper.getAuth()?.access_token ||
  //       authHelper.getAuth()?.api_token;

  //     const formData = new FormData();
  //     formData.append("profile_picture", file);
  //     console.log(import.meta.env.VITE_APP_API_URL);


  //     const response = await axios.put(`/api/auth/profile-picture`,
  //       formData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     console.log("Backend:", response.data);

  //     const newProfile =
  //       response?.data?.data?.user?.profile_picture ||
  //       response?.data?.data?.profile_picture ||
  //       response?.data?.data?.file_info?.filename;

  //     console.log("NEW PROFILE PIC:", newProfile);

  //     if (!newProfile) {
  //       console.error("Backend did not return correct profile_picture");
  //       return null;
  //     }

  //     const updatedUser = await getUser(token);
  //     setCurrentUser(updatedUser);

  //     return updatedUser;
  //   } catch (error: any) {
  //     console.error("Update error:", error.response?.data || error);
  //     return null;
  //   }
  // };

  const MAX_MB = 1.5;

  const updateProfileImage = async (file: File): Promise<UserModel> => {
    const sizeMB = file.size / (1024 * 1024);

    console.log("Selected file:", {
      name: file.name,
      size_mb: sizeMB.toFixed(2),
      type: file.type,
    });

    if (sizeMB > MAX_MB) {
      throw new Error(`IMAGE_TOO_LARGE_${MAX_MB}`);
    }

    const token =
      auth?.access_token ||
      auth?.api_token ||
      authHelper.getAuth()?.access_token ||
      authHelper.getAuth()?.api_token;

    if (!token) throw new Error("AUTH_REQUIRED");

    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      const response = await axios.put(
        `/api/auth/profile-picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Upload success:", response.data);

      const updatedUser = await getUser(token);
      setCurrentUser(updatedUser);
      return updatedUser;

    } catch (error: any) {
      const status = error?.response?.status;

      if (status === 413) {
        throw new Error("BACKEND_IMAGE_TOO_LARGE");
      }

      if (error?.message === "Network Error") {
        throw new Error("NETWORK_ERROR");
      }

      throw new Error("UPLOAD_FAILED");
    }
  };




  const changeLanguage = async (langCode: string) => {
    try {
      const token =
        auth?.access_token ||
        auth?.api_token ||
        authHelper.getAuth()?.access_token;

      if (!token) throw new Error("No token available");

      let response;

      // Use POST /api/auth/preferences for first-time users (is_preference_setup_done = false)
      // Use PUT /api/auth/preferences for existing users (is_preference_setup_done = true)
      if (currentUser && !currentUser.is_preference_setup_done) {
        // First-time user: use POST /api/auth/preferences
        // Send only language_code with all other fields empty
        const payload = {
          preferences: {
            language_code: langCode,
            bible_version: "",
            depth_level: "",
            experience_with_bible: [],
            what_brings_you: "",
            engagement_preference: [],
            explanation_style: "",
            receive_daily: false
          }
        };

        response = await axios.post(`/api/auth/preferences`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // Existing user: use PUT /api/auth/preferences
        // Update only language_code
        const payload = {
          preferences: {
            language_code: langCode
          }
        };

        response = await axios.put(`/api/auth/preferences`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      // Verify response status
      if (response.data?.status === 1) {
        // SUCCESSFUL
        // Update user context with new language immediately if possible, 
        // or re-fetch user to get latest state
        const updatedUser = await getUser(token);
        setCurrentUser(updatedUser);

        return {
          success: true,
          message: response.data.message || "Language changed successfully",
          data: response.data.data
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Failed to change language"
        };
      }

    } catch (error: any) {
      console.error("Language change error:", error.response?.data || error);
      return {
        success: false,
        message: error.response?.data?.message || "Something went wrong"
      };
    }
  };


  const verifyResetToken = async (token: string) => {
    try {
      const response = await axios.get(`/api/auth/verify-reset-token/${token}`);
      return {
        success: response.data?.status === 1,
        message: response.data?.message,
        data: response.data?.data
      };



    } catch (error: any) {
      console.error("verifyResetToken ERROR:", error.response?.data || error);

      return {
        success: false,
        message: error.response?.data?.message || "Invalid or expired reset token"
      };
    }
  };



  const logout = () => {
    saveAuth(undefined);
    setCurrentUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        loading, setLoading, auth, saveAuth, currentUser, setCurrentUser, login, register, requestPasswordResetLink, changePassword,
        getUser, saveUserPreferences, updateUserPreferences, saveOrUpdateUserPreferences, updateProfileImage, loginWithGoogle, logout,
        verify, profileProgress, setProfileProgress, refreshDashboard, changeLanguage, verifyResetToken,


      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
