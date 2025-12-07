// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Button } from '@/components/ui/button';
// import { Switch } from '@/components/ui/switch';
// import { 
//   Settings, 
//   Globe, 
//   Clock, 
//   Languages,
//   Save,
//   RefreshCw
// } from 'lucide-react';

// const GeneralSettings = ({ user }: { user: any }) => {
//   const defaultLanguage = user?.language || 'English';  // for API data
//   return (
//     <Card id="general_settings" className='bg-white/40 dark:bg-gray-100 '>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Settings className="w-5 h-5" />
//           General Settings
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//           <div className="space-y-2">
//             <Label htmlFor="language">Default Language</Label>
//             <div className="flex items-center gap-2">
//               <Languages className="w-4 h-4 text-gray-400" />
//               <Input 
//                 id="language" 
//                 placeholder="Select language"
//                 defaultValue={defaultLanguage} // change for API data
//               />
//             </div>
//           </div>

//         </div>

//         <div className="space-y-4">
//           <div className="space-y-3">




//             {/* Audio Mode - Hidden for now */}
//             {/* <div className="flex items-center justify-between">
//               <div>
//                 <Label htmlFor="auto_backup">Audio Mode</Label>
//                 <p className="text-sm text-gray-500">Enable/Disable audio mode</p>
//               </div>
//               <Switch id="auto_backup" defaultChecked />
//             </div> */}


//           </div>
//         </div>

//         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
//           <Button className="flex items-center justify-center gap-2 w-full sm:w-auto">
//             <Save className="w-4 h-4" />
//             Save Settings
//           </Button>
//           <Button variant="outline" className="flex items-center justify-center gap-2 w-full sm:w-auto">
//             <RefreshCw className="w-4 h-4" />
//             Reset to Default
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export { GeneralSettings };

















import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Languages, Save, RefreshCw } from 'lucide-react';
import { useAuthContext } from "@/auth";
import { useState, useEffect } from "react";
import { useLanguage } from '@/providers/TranslationProvider';
import { I18N_LANGUAGES } from '@/i18n';
import { FormattedMessage } from 'react-intl';
import { toast } from "sonner";

const GeneralSettings = ({ user }: { user: any }) => {
  const { changeLanguage } = useAuthContext();
  const [languageLoading, setLanguageLoading] = useState(false);
  const { currentLanguage } = useLanguage();

  const [language, setLanguage] = useState(currentLanguage.code);

  // When global language changes from dropdown, update this page as well
  useEffect(() => {
    setLanguage(currentLanguage.code);
  }, [currentLanguage.code]);

  const handleSave = async () => {
    try {
      setLanguageLoading(true);
      const res = await changeLanguage(language);

      if (res?.success) {
        toast.success("Language updated");
        setTimeout(() => {
          window.location.reload();
        }, 600);
      } else {
        toast.error("Failed: " + (res?.message || "Unknown error"));
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setLanguageLoading(false);
    }
  };

  // const handleReset = () => {
  //   setLanguage("en");
  // };

  const handleReset = async () => {
    setLanguage("en");
    setLanguageLoading(true);

    try {
      const res = await changeLanguage("en");

      if (res?.success) {
        toast.success("Language reset to English");
        setTimeout(() => {
          window.location.reload();
        }, 600);
      } else {
        toast.error(res?.message || "Failed to reset");
      }
    } catch (e) {
      toast.error("An error occurred");
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
                      {lang.label}
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






