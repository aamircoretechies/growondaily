/* eslint-disable no-unused-vars */
import axios, { AxiosResponse } from 'axios';
import { createContext, type Dispatch, type PropsWithChildren, type SetStateAction, useEffect, useState } from 'react';

import * as authHelper from '../_helpers';
import { type AuthModel, type UserModel } from '@/auth';

const API_URL = import.meta.env.VITE_APP_API_URL;
export const LOGIN_URL = `/api/auth/login`;
export const REGISTER_URL = `/api/auth/create-account`;
export const FORGOT_PASSWORD_URL = `/api/auth/forgot-password`;
export const RESET_PASSWORD_URL = `/api/auth/reset-password`;
export const GET_USER_URL = `/api/auth/profile`;

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
    email: string,
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

}

const AuthContext = createContext<AuthContextProps | null>(null);

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

  const calculateProfileProgress = (user: UserModel): number => {
    if (!user) return 0;
    const prefs = user.preferences || {};

    const checks = [
      user.first_name,
      user.last_name,
      prefs.experience_with_bible?.length,
      prefs.what_brings_you,
      prefs.engagement_preference?.length,
      prefs.explanation_style,
      prefs.bible_version,
      prefs.receive_daily !== undefined,
      prefs.depth_level,
    ];

    const completed = checks.filter(Boolean).length;
    const total = checks.length;

    return Math.round((completed / total) * 100);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(LOGIN_URL,
        { email, password },
        { withCredentials: true }
      );

      const authData = response.data.data;
      if (!authData?.token) throw new Error("Please Enter Valid email or password");

      const authObj: AuthModel = {
        access_token: authData.token,
        api_token: authData.token,
        refreshToken: undefined
      };
      saveAuth(authObj);

      // fetch authoritative user and set
      const user = await getUser(authData.token);
      setProfileProgress(calculateProfileProgress(user));
      localStorage.removeItem("profileProgress");
      setCurrentUser(user);
    } catch (error: any) {
      console.error("LOGIN ERROR:", error);
      saveAuth(undefined);
      // throw new Error(`Error ${error}`);
      let msg =
        error?.response?.data?.message ||
        error?.message || "Invalid email or password";
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

  const changePassword = async (
    email: string,
    token: string,
    password: string,
    password_confirmation: string
  ) => {
    await axios.post(RESET_PASSWORD_URL, {
      email,
      token,
      password,
      password_confirmation
    });
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

      const progress = calculateProfileProgress(fullUser);
      setProfileProgress(progress);
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
        language_code: 'en',
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
      setProfileProgress(calculateProfileProgress(updatedUser));
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
        language_code: "en",
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



      setProfileProgress(calculateProfileProgress(refreshedUser));
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
      const progress = calculateProfileProgress(userProfile);
      setProfileProgress(progress);
      console.log(" User profile set:", userProfile);

      try {
        const fullUser = await getUser(token);
        setCurrentUser(fullUser);
        setProfileProgress(calculateProfileProgress(fullUser));
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

  //     if (!token) {
  //       throw new Error("No auth token found");
  //     }

  //     const formData = new FormData();
  //     formData.append("profile_picture", file);

  //     const response = await axios.put(`/api/auth/profile-picture`,
  //       formData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     const updatedUser = await getUser(token);
  //     setCurrentUser(updatedUser);

  //     return updatedUser;
  //   } catch (error: any) {
  //     console.error("Profile Image Update Error:", error.response?.data || error);
  //     return null;
  //   }
  // };

  const updateProfileImage = async (file: File): Promise<UserModel | null> => {
    try {
      const token =
        auth?.access_token ||
        auth?.api_token ||
        authHelper.getAuth()?.access_token ||
        authHelper.getAuth()?.api_token;

      const formData = new FormData();
      formData.append("profile_picture", file);
      console.log(import.meta.env.VITE_APP_API_URL);


      const response = await axios.put(`/api/auth/profile-picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Backend:", response.data);

      // Smart handling
      const newProfile =
        response?.data?.data?.user?.profile_picture ||
        response?.data?.data?.profile_picture ||
        response?.data?.data?.file_info?.filename;

      console.log("NEW PROFILE PIC:", newProfile);

      if (!newProfile) {
        console.error("Backend did not return correct profile_picture");
        return null;
      }

      const updatedUser = await getUser(token);
      setCurrentUser(updatedUser);

      return updatedUser;
    } catch (error: any) {
      console.error("Update error:", error.response?.data || error);
      return null;
    }
  };


  const changeLanguage = async (langCode: string) => {
    try {
      const token =
        auth?.access_token ||
        auth?.api_token ||
        authHelper.getAuth()?.access_token;

      if (!token) throw new Error("No token available");

      const response = await axios.post(`/api/auth/change-language`,
        { language: langCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // SUCCESSFUL
      const updatedUser = await getUser(token);
      setCurrentUser(updatedUser);

      return response.data;
    } catch (error: any) {
      console.error("Language change error:", error.response?.data || error);
      throw error;
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
        verify, profileProgress, setProfileProgress, refreshDashboard,changeLanguage,

      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
