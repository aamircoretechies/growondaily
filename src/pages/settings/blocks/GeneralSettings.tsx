import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Languages, Save, RefreshCw } from 'lucide-react';
import { useAuthContext } from "@/auth";
import { useState, useEffect } from "react";
import { useLanguage } from '@/providers/TranslationProvider';
import { I18N_LANGUAGES } from '@/i18n';
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from "sonner";

const GeneralSettings = ({ user }: { user: any }) => {
  const { formatMessage } = useIntl();
  const { changeLanguage } = useAuthContext();
  const [languageLoading, setLanguageLoading] = useState(false);
  const { currentLanguage, changeLanguage: changeFrontendLanguage } = useLanguage();

  const [language, setLanguage] = useState(currentLanguage.code);

  // When global language changes from dropdown, update this page as well
  useEffect(() => {
    setLanguage(currentLanguage.code);
  }, [currentLanguage.code]);

  // const handleSave = async () => {
  //   try {
  //     setLanguageLoading(true);
  //     const res = await changeLanguage(language);

  //     if (res?.success) {
  //       toast.success("Language updated");
  //       setTimeout(() => {
  //         window.location.reload();
  //       }, 600);
  //     } else {
  //       toast.error("Failed: " + (res?.message || "Unknown error"));
  //     }
  //   } catch (e) {
  //     toast.error("An error occurred");
  //   } finally {
  //     setLanguageLoading(false);
  //   }
  // };

  // const handleReset = () => {
  //   setLanguage("en");
  // };

  const handleSave = async () => {
    try {
      setLanguageLoading(true);

      // ✅ FRONTEND language update
      const selectedLang = I18N_LANGUAGES.find(l => l.code === language);
      if (selectedLang) {
        changeFrontendLanguage(selectedLang);
      }

      // ✅ BACKEND update
      const res = await changeLanguage(language);

      if (res?.success) {
        toast.success(res?.message || `Language changed to ${selectedLang?.label}`);

        // ✅ CONTROLLED REFRESH
        setTimeout(() => {
          window.location.reload();
        }, 500);

      } else {
        toast.error(res?.message || "Failed to change language");
      }
    } catch (e) {
      toast.error("Failed to change language");
    } finally {
      setLanguageLoading(false);
    }
  };


  // const handleReset = async () => {
  //   setLanguage("en");
  //   setLanguageLoading(true);

  //   try {
  //     const res = await changeLanguage("en");

  //     if (res?.success) {
  //       toast.success("Language reset to English");
  //       setTimeout(() => {
  //         window.location.reload();
  //       }, 600);
  //     } else {
  //       toast.error(res?.message || "Failed to reset");
  //     }
  //   } catch (e) {
  //     toast.error("An error occurred");
  //   } finally {
  //     setLanguageLoading(false);
  //   }
  // };

  const handleReset = async () => {
    try {
      setLanguage("en");
      setLanguageLoading(true);

      const englishLang = I18N_LANGUAGES.find(l => l.code === "en");
      if (englishLang) {
        changeFrontendLanguage(englishLang);
      }

      const res = await changeLanguage("en");

      if (res?.success) {
        toast.success(res?.message || `Language changed to ${englishLang?.label}`);

        setTimeout(() => {
          window.location.reload();
        }, 500);

      } else {
        toast.error(res?.message || "Failed to change language");
      }
    } catch (e) {
      toast.error("Failed to change language");
    } finally {
      setLanguageLoading(false);
    }
  };



  return (
    <Card id="general_settings" className='bg-white/40 dark:bg-gray-100'>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          <FormattedMessage id="SETTINGS.GENERAL" />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="language">
              <FormattedMessage id="SETTINGS.DEFAULT_LANGUAGE" />
            </Label>
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-gray-400" />

              {/* FIXED: Added type for val */}
              <Select defaultValue={language} onValueChange={(val: any) => setLanguage(val)}>
                <SelectTrigger className="w-full bg-gray-100 rounded-xl border border-gray-300 text-gray-700">
                  <SelectValue placeholder={<FormattedMessage id="SETTINGS.SELECT_LANGUAGE" />} />
                </SelectTrigger>
                <SelectContent>
                  {I18N_LANGUAGES.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {formatMessage({ id: `LANGUAGE.${lang.code.toUpperCase()}` })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
          <Button
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
            onClick={handleSave}
            disabled={languageLoading}
          >
            <Save className="w-4 h-4" />
            {languageLoading ? <FormattedMessage id="SETTINGS.SAVING" /> : <FormattedMessage id="SETTINGS.SAVE_SETTINGS" />}
          </Button>

          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
            onClick={handleReset}
          >
            <RefreshCw className="w-4 h-4" />
            <FormattedMessage id="SETTINGS.RESET_TO_DEFAULT" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { GeneralSettings };






