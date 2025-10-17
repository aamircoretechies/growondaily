import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Globe, 
  Clock, 
  Languages,
  Save,
  RefreshCw
} from 'lucide-react';

const GeneralSettings = () => {
  return (
    <Card id="general_settings" className='bg-white/40 dark:bg-gray-100 '>
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
              <Input 
                id="language" 
                placeholder="Select language"
                defaultValue="English"
              />
            </div>
          </div>
        
        </div>
        
        <div className="space-y-4">
          <div className="space-y-3">
           
            
          
            
            {/* Audio Mode - Hidden for now */}
            {/* <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto_backup">Audio Mode</Label>
                <p className="text-sm text-gray-500">Enable/Disable audio mode</p>
              </div>
              <Switch id="auto_backup" defaultChecked />
            </div> */}
            
           
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
          <Button className="flex items-center justify-center gap-2 w-full sm:w-auto">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-2 w-full sm:w-auto">
            <RefreshCw className="w-4 h-4" />
            Reset to Default
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { GeneralSettings };
