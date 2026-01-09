// import { useEffect } from 'react';
// import { BrowserRouter } from 'react-router-dom';
// import { useSettings } from '@/providers/SettingsProvider';
// import { AppRouting } from '@/routing';
// import { PathnameProvider } from '@/providers';
// import { Toaster } from '@/components/ui/sonner';

// const { BASE_URL } = import.meta.env;

// const App = () => {
//   const { settings } = useSettings();

//   useEffect(() => {
//     document.documentElement.classList.remove('dark');
//     document.documentElement.classList.remove('light');
//     document.documentElement.classList.add(settings.themeMode);
//   }, [settings]);

//   return (
//     <BrowserRouter
//       basename={BASE_URL}
//       future={{
//         v7_relativeSplatPath: true,
//         v7_startTransition: true
//       }}
//     >
//       <PathnameProvider>
//         <AppRouting />
//       </PathnameProvider>
//       <Toaster />
//     </BrowserRouter>
//   );
// };

// export { App };







import { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { useSettings } from '@/providers/SettingsProvider';
import { AppRouting } from '@/routing';
import { PathnameProvider } from '@/providers';
import { Toaster } from '@/components/ui/sonner';
import { useIntl } from 'react-intl';

const { BASE_URL } = import.meta.env;

const App = () => {
  const { settings } = useSettings();
  const location = useLocation();
  const { formatMessage } = useIntl();

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add(settings.themeMode);
  }, [settings]);

  useEffect(() => {
    const path = location.pathname;

    const titles: Record<string, string> = {
      "/home": formatMessage({ id: 'NAV.HOME' }),
      "/reflection": formatMessage({ id: 'NAV.REFLECTION' }),
      "/bible": formatMessage({ id: 'NAV.BIBLE' }),
      "/ask": formatMessage({ id: 'NAV.ASK' }),
      "/settings": formatMessage({ id: 'NAV.SETTINGS' })
    };

    document.title = titles[path] || "GrowOnDaily";
  }, [location.pathname, formatMessage]);

  return (
    <PathnameProvider>
      <AppRouting />
      <Toaster />
    </PathnameProvider>
  );
};

// BrowserRouter ko neeche wrapper bnaya gya hai
const AppWrapper = () => (
  <BrowserRouter
    basename={BASE_URL}
    future={{
      v7_relativeSplatPath: true,
      v7_startTransition: true
    }}
  >
    <App />
  </BrowserRouter>
);

export { AppWrapper as App };