import { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { AuthProvider } from '@/auth/providers/JWTProvider';
import {
  LayoutProvider,
  LoadersProvider,
  MenusProvider,
  SettingsProvider,
  SnackbarProvider,
  TranslationProvider
} from '@/providers';
import { HelmetProvider } from 'react-helmet-async';
import { DashboardProvider } from '@/pages/dashboards/providers/DashboardProvider';
import { BibleProvider } from '@/providers';
import { ReflectionProvider } from "@/providers/ReflectionProvider";
import { SettingEditProvider } from '@/pages/settings/Provider/SettingeEditProvider';



const queryClient = new QueryClient();

const ProvidersWrapper = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SettingsProvider>
          <TranslationProvider>
            <HelmetProvider>
              <LayoutProvider>
                <LoadersProvider>
                  <DashboardProvider>
                    <BibleProvider>
                      <ReflectionProvider>
                        <SettingEditProvider>
                  <MenusProvider>{children}</MenusProvider>
                        </SettingEditProvider>
                    </ReflectionProvider>
                  </BibleProvider>
                  </DashboardProvider>
                </LoadersProvider>
              </LayoutProvider>
            </HelmetProvider>
          </TranslationProvider>
        </SettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export { ProvidersWrapper };
