/* eslint-disable no-unused-vars */
import axios, { AxiosResponse } from 'axios';
import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useEffect,
  useState
} from 'react';

import * as authHelper from '../_helpers';
import { type AuthModel, type UserModel } from '@/auth';

const API_URL = import.meta.env.VITE_APP_API_URL;
// export const LOGIN_URL = `${API_URL}/login`;
export const LOGIN_URL = `${API_URL}/api/auth/login`;

// export const REGISTER_URL = `${API_URL}/register`;
export const REGISTER_URL = `${API_URL}/api/auth/create-account`;
export const FORGOT_PASSWORD_URL = `${API_URL}/api/auth/forgot-password`;
// export const RESET_PASSWORD_URL = `${API_URL}/reset-password`;
export const RESET_PASSWORD_URL = `${API_URL}/api/auth/reset-password`;
// export const GET_USER_URL = `${API_URL}/user`;
export const GET_USER_URL = `${API_URL}/api/auth/profile`;


interface AuthContextProps {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  auth: AuthModel | undefined;
  saveAuth: (auth: AuthModel | undefined) => void;
  currentUser: UserModel | undefined;
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle?: () => Promise<void>;
  loginWithFacebook?: () => Promise<void>;
  loginWithGithub?: () => Promise<void>;
  register: (email: string, password: string, password_confirmation: string) => Promise<{ success: boolean; data?: any }>;
  requestPasswordResetLink: (email: string) => Promise<void>;
  changePassword: (
    email: string,
    token: string,
    password: string,
    password_confirmation: string
  ) => Promise<void>;
  // getUser: () => Promise<AxiosResponse<any>>;
  getUser: (tokenFromLogin?: string) => Promise<UserModel>;
  saveUserPreferences: (preferencesData: any) => Promise<any>;
  updateUserPreferences: (preferencesData: any) => Promise<any>;
  saveOrUpdateUserPreferences: (preferencesData: any) => Promise<any>;

  logout: () => void;
  verify: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth());
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>();

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

  // Initialize user on app load or when auth changes
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.access_token]);

  
  const login = async (email: string, password: string) => {
    console.log("this is user input", email, password);
    try {
      const response = await axios.post(
        LOGIN_URL,
        { email, password },
        { withCredentials: true }
      );

      console.log("LOGIN RESPONSE:", response.data);

      const authData = response.data.data;

      if (!authData?.token) {
        throw new Error("No token found in response");
      }
      const auth: AuthModel = {
        access_token: authData.token,
        api_token: authData.token,
        refreshToken: undefined
      };
      saveAuth(auth);
      const user = await getUser(authData.token);
      setCurrentUser(user);
    } catch (error: any) {
      console.error("LOGIN ERROR:", error);
      saveAuth(undefined);
      throw new Error(`Error ${error}`);
    }
  };


  const register = async (email: string, password: string, password_confirmation: string) => {
    try {
      const { data: auth } = await axios.post(REGISTER_URL, {
        email,
        password,
        re_password: password_confirmation,
      });

      console.log("REGISTER_URL:", REGISTER_URL);
      console.log("REGISTER RESPONSE:", auth);

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




  // const requestPasswordResetLink = async (email: string) => {
  //   await axios.post(FORGOT_PASSWORD_URL, {
  //     email
  //   });
  // };
  const requestPasswordResetLink = async (email: string) => {
    console.log("Sending forgot password request for:", email);
    console.log("API URL:", FORGOT_PASSWORD_URL);

    try {
      const response = await axios.post(FORGOT_PASSWORD_URL, { email });

      console.log("Forgot password API success:", response.data);
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

  // const getUser = async () => {
  //   return await axios.get<UserModel>(GET_USER_URL);
  // };


  // Profile GET API, in Context way 
  const getUser = async (tokenFromLogin?: string): Promise<UserModel> => {
    const token = tokenFromLogin || auth?.access_token || auth?.api_token;
    if (!token) throw new Error("No token found");

    console.log("GET_USER TOKEN:", token);

    try {
      const response = await axios.get(GET_USER_URL, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: false,
      });
      const apiUser = response.data?.data?.user as UserModel;
      const apiPreferences = response.data?.data?.preferences;
      // Merge preferences into the user for easier hydration downstream
      return { ...apiUser, preferences: apiPreferences } as UserModel;

    } catch (error: any) {
      console.error("PROFILE ERROR:", error.response?.data || error);
      throw error;
    }
  };

const saveUserPreferences = async (preferencesData: any) => {
  // Prefer token from in-memory auth state; fall back to helper
  let token = auth?.access_token || auth?.api_token || authHelper.getAuth()?.access_token || authHelper.getAuth()?.api_token || "";

  if (!token) {
    throw new Error("No auth token found. Please login first.");
  }

  console.log("Saving user preferences:", preferencesData);

  try {
    // Transform UI-shaped preferences into backend canonical format
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
      explanation_style: (preferencesData?.explain || '').toLowerCase().includes('simple')
        ? 'simple'
        : (preferencesData?.explain || '').toLowerCase().includes('deeper')
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

    const response = await axios.post(
      `${API_URL}/api/auth/preferences`,
      { preferences: payloadPreferences },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: false,
      }
    );

    console.log(" Preferences API Response:", response.data);

    const updatedUser = await getUser(token);
    setCurrentUser(updatedUser);

    return response.data;
  } catch (error: any) {
    console.error(" Preferences API Error:", error.response?.data || error.message);
    throw error;
  }
};

const updateUserPreferences = async (preferencesData: any) => {
  let token = auth?.access_token || auth?.api_token || authHelper.getAuth()?.access_token || authHelper.getAuth()?.api_token || "";

  if (!token) {
    throw new Error("No auth token found. Please login first.");
  }

  console.log("Updating user preferences:", preferencesData);

  try {
    const toBackendEnum = (value: string) =>
      (value || '')
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '_')
        .replace(/^_|_$/g, '');

    const experienceMap: Record<string, string> = {
      'FIRST TIME': 'NEW_TO_BIBLE',
      'OCCASIONAL': 'SOME_KNOWLEDGE',
      'REGULAR': 'REGULAR_STUDY',
      'THEOLOGICAL': 'ADVANCED_THEOLOGY',
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
      explanation_style: (preferencesData?.explain || '').toLowerCase().includes('simple')
        ? 'simple'
        : (preferencesData?.explain || '').toLowerCase().includes('deeper')
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

    const response = await axios.put(
      `${API_URL}/api/auth/preferences`,
      { preferences: payloadPreferences },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: false,
      }
    );

    console.log(" Preferences PUT Response:", response.data);

    const updatedUser = await getUser(token);
    setCurrentUser(updatedUser);

    return response.data;
  } catch (error: any) {
    console.error(" Preferences PUT Error:", error.response?.data || error.message);
    throw error;
  }
};

const saveOrUpdateUserPreferences = async (preferencesData: any) => {
  if (currentUser?.is_preference_setup_done) {
    return updateUserPreferences(preferencesData);
  }
  return saveUserPreferences(preferencesData);
};


  const logout = () => {
    saveAuth(undefined);
    setCurrentUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        auth,
        saveAuth,
        currentUser,
        setCurrentUser,
        login,
        register,
        requestPasswordResetLink,
        changePassword,
        getUser,
        saveUserPreferences,
        updateUserPreferences,
        saveOrUpdateUserPreferences,
        logout,
        verify
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
