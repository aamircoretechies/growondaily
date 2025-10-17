import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Mail, 
  Send, 
  Settings,
  Save,
  TestTube,
  Bell,
  RefreshCw
} from 'lucide-react';

const NotificationsEmail = () => {
  return (
    <Card id="notifications_email" className='bg-white/40 dark:bg-gray-100 '>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
        <Bell className="w-5 h-5" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        
    
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Notification Types</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="welcome_emails">Notifications</Label>
                <p className="text-sm text-gray-500">In-app notifications</p>
              </div>
              <Switch id="welcome_emails" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="password_reset">Push Notifications</Label>
                <p className="text-sm text-gray-500">Push notifications in the system</p>
              </div>
              <Switch id="password_reset" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="content_notifications">Email Notifications</Label>
                <p className="text-sm text-gray-500">Notifications to the registered email</p>
              </div>
              <Switch id="content_notifications" defaultChecked />
            </div>
            
           
          </div>
        </div>
        
        <div className="flex items-center gap-3 pt-4">
          <Button className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
       
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Reset to Default
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { NotificationsEmail };
