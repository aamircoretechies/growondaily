import { User as Auth0UserModel } from '@auth0/auth0-spa-js';

import { getData, setData } from '@/utils';
import { type AuthModel } from './_models';
import { I18N_CONFIG_KEY, I18N_DEFAULT_LANGUAGE, I18N_LANGUAGES } from '@/i18n';
import { type TLanguage } from '@/i18n';

const AUTH_LOCAL_STORAGE_KEY = `${import.meta.env.VITE_APP_NAME}-auth-v${import.meta.env.VITE_APP_VERSION
  }`;

const getAuth = (): AuthModel | undefined => {
  try {
    const auth = getData(AUTH_LOCAL_STORAGE_KEY) as AuthModel | undefined;

    if (auth) {
      return auth;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error);
  }
};

const setAuth = (auth: AuthModel | Auth0UserModel) => {
  setData(AUTH_LOCAL_STORAGE_KEY, auth);
};

const removeAuth = () => {
  if (!localStorage) {
    return;
  }

  try {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error);
  }
};

// Get current language from localStorage
const getCurrentLanguage = (): TLanguage => {
  try {
    const storedConfig = getData(I18N_CONFIG_KEY) as any;
    const storedCode = typeof storedConfig === 'string' ? storedConfig : storedConfig?.code;

    if (storedCode) {
      const matchedLanguage = I18N_LANGUAGES.find((l: TLanguage) => l.code === storedCode);
      if (matchedLanguage) return matchedLanguage;
    }

    return I18N_DEFAULT_LANGUAGE;
  } catch (error) {
    return I18N_DEFAULT_LANGUAGE;
  }
};

export function setupAxios(axios: any) {
  axios.defaults.headers.Accept = 'application/json';
  axios.defaults.withCredentials = true;
  axios.interceptors.request.use(
    (config: {
      method?: string;
      headers: { Authorization?: string };
      params?: any;
      url?: string;
      data?: any;
    }) => {
      const auth = getAuth();

      if (auth?.access_token) {
        config.headers.Authorization = `Bearer ${auth.access_token}`;
      }

      const currentLanguage = getCurrentLanguage();
      const langCode = currentLanguage.code;

      // Add Accept-Language header
      (config.headers as any)['Accept-Language'] = langCode;

      // Add language code to all API requests
      if (config.url && config.url.startsWith('/api')) {
        // For GET requests, add to params
        if (!config.method || config.method.toLowerCase() === 'get') {
          config.params = config.params || {};
          // Only add if not already present
          if (!config.params.lang) {
            config.params.lang = langCode;
          }
        } else {
          // For POST/PUT/PATCH/DELETE, add to URL as query parameter
          const separator = config.url.includes('?') ? '&' : '?';
          // Check if lang is already in URL
          if (!config.url.includes('lang=')) {
            config.url = `${config.url}${separator}lang=${langCode}`;
          }
        }
      }

      return config;
    },
    async (err: any) => await Promise.reject(err)
  );
}

const getAccessToken = (): string | null => {
  try {
    const auth = getAuth();
    return auth?.access_token || (auth as any)?.api_token || null;
  } catch (err) {
    console.error('getAccessToken error', err);
    return null;
  }
};


export { AUTH_LOCAL_STORAGE_KEY, getAuth, removeAuth, setAuth, getAccessToken, getCurrentLanguage };
