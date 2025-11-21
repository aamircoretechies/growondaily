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
import { useSettingEdit } from "../Provider/SettingeEditProvider";
import { useState } from "react";
import { useLanguage } from '@/providers/TranslationProvider';
import { I18N_LANGUAGES, I18N_CONFIG_KEY } from '@/i18n';  
import { setData } from '@/utils';                         

const GeneralSettings = ({ user }: { user: any }) => {
  const { selectLanguage, languageLoading } = useSettingEdit();
  const { changeLanguage } = useLanguage();
  const [language, setLanguage] = useState(user?.language_code || "en");

  const handleSave = async () => {
    const res = await selectLanguage(language);

    if (res.success) {
      const selectedLang = I18N_LANGUAGES.find((lang) => lang.code === language);
      if (selectedLang) {
        setData(I18N_CONFIG_KEY, selectedLang);
        changeLanguage(selectedLang);
        window.location.reload();
      }
      // alert(res.message);
    } else {
      alert("Failed: " + res.message);
    }
  };

  const handleReset = () => {
    setLanguage("en");
  };

  return (
    <Card id="general_settings" className='bg-white/40 dark:bg-gray-100'>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          General Settings
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="language">Default Language</Label>
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-gray-400" />
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full bg-gray-100 rounded-xl border border-gray-300 text-gray-700 focus:ring-2 focus:ring-sand/50">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="nl">Dutch</SelectItem>
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
            {languageLoading ? "Saving..." : "Save Settings"}
          </Button>

          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
            onClick={handleReset}
          >
            <RefreshCw className="w-4 h-4" />
            Reset to Default
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { GeneralSettings };




