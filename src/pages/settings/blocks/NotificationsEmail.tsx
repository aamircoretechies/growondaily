// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Button } from '@/components/ui/button';
// import { Switch } from '@/components/ui/switch';
// import { 
//   Mail, 
//   Send, 
//   Settings,
//   Save,
//   TestTube,
//   Bell,
//   RefreshCw
// } from 'lucide-react';

// const NotificationsEmail = () => {
//   return (
//     <Card id="notifications_email" className='bg-white/40 dark:bg-gray-100 '>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//         <Bell className="w-5 h-5" />
//           Notification Settings
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-6">

//         <div className="space-y-4">
//           <h4 className="font-medium text-gray-900">Notification Types</h4>
//           <div className="space-y-3">
//             <div className="flex items-center justify-between">
//               <div>
//                 <Label htmlFor="welcome_emails">Notifications</Label>
//                 <p className="text-sm text-gray-500">In-app notifications</p>
//               </div>
//               <Switch id="welcome_emails" defaultChecked />
//             </div>

//             <div className="flex items-center justify-between">
//               <div>
//                 <Label htmlFor="password_reset">Push Notifications</Label>
//                 <p className="text-sm text-gray-500">Push notifications in the system</p>
//               </div>
//               <Switch id="password_reset" defaultChecked />
//             </div>

//             <div className="flex items-center justify-between">
//               <div>
//                 <Label htmlFor="content_notifications">Email Notifications</Label>
//                 <p className="text-sm text-gray-500">Notifications to the registered email</p>
//               </div>
//               <Switch id="content_notifications" defaultChecked />
//             </div>


//           </div>
//         </div>

//         <div className="flex items-center gap-3 pt-4">
//           <Button className="flex items-center gap-2">
//             <Save className="w-4 h-4" />
//             Save Settings
//           </Button>

//           <Button variant="outline" className="flex items-center gap-2">
//             <RefreshCw className="w-4 h-4" />
//             Reset to Default
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export { NotificationsEmail };











import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Save, RefreshCw } from "lucide-react";
import { useSettingEdit } from "../Provider/SettingeEditProvider";
import { FormattedMessage } from 'react-intl';

const NotificationsEmail = () => {
  const { getNotificationPreferences, updateNotificationPreferences, notificationLoading } = useSettingEdit();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true); // main switch
  const [emailNotification, setEmailNotification] = useState(false);
  const [pushNotification, setPushNotification] = useState(false);
  const [defaultPrefs, setDefaultPrefs] = useState<any>(null);
  const [message, setMessage] = useState("");

  // Fetch notification preferences on mount
  useEffect(() => {
    const fetchPreferences = async () => {
      const res = await getNotificationPreferences();
      if (res.success) {
        const { email_notification, push_notification } = res.data;
        setEmailNotification(email_notification);
        setPushNotification(push_notification);
        setNotificationsEnabled(email_notification || push_notification);
        setDefaultPrefs(res.data);
      } else {
        setMessage(res.message);
      }
    };

    fetchPreferences();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000); // 3 seconds baad message hide ho jaayega
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Main Notifications toggle (no API call here)
  const handleMainToggle = (checked: boolean) => {
    setNotificationsEnabled(checked);
    const newEmail = checked ? true : false;
    const newPush = checked ? true : false;
    setEmailNotification(newEmail);
    setPushNotification(newPush);
    setMessage(""); // clear previous messages
  };

  // Individual toggle (no API call here)
  const handleToggle = (type: "email" | "push", checked: boolean) => {
    let updatedEmail = emailNotification;
    let updatedPush = pushNotification;

    if (type === "email") updatedEmail = checked;
    else updatedPush = checked;

    // agar dono off hain to main bhi off ho jaaye
    const newMainState = updatedEmail || updatedPush;
    setNotificationsEnabled(newMainState);

    setEmailNotification(updatedEmail);
    setPushNotification(updatedPush);
    setMessage("");
  };

  // Save button (actual API call only here)
  const handleSave = async () => {
    const res = await updateNotificationPreferences({
      email_notification: emailNotification,
      push_notification: pushNotification,
    });
    setMessage(res.message);
  };

  // const handleReset = async () => {
  //   if (defaultPrefs) {
  //     const { email_notification, push_notification } = defaultPrefs;
  //     setEmailNotification(email_notification);
  //     setPushNotification(push_notification);
  //     setNotificationsEnabled(email_notification || push_notification);
  //     setMessage("Reset to default preferences");
  //   } else {
  //     const res = await getNotificationPreferences();
  //     if (res.success) {
  //       const { email_notification, push_notification } = res.data;
  //       setEmailNotification(email_notification);
  //       setPushNotification(push_notification);
  //       setNotificationsEnabled(email_notification || push_notification);
  //       setDefaultPrefs(res.data);
  //       setMessage("Reset to default preferences");
  //     }
  //   }
  // };

  // Reset to Default button
 
  const handleReset = async () => {

    setEmailNotification(true);
    setPushNotification(true);
    setNotificationsEnabled(true);

    setMessage("Preferences reset — All notifications enabled");
  };


  return (
    <Card id="notifications_email" className="bg-white/40 dark:bg-gray-100 ">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          <FormattedMessage id="SETTINGS.NOTIFICATION_SETTINGS" />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">
            <FormattedMessage id="SETTINGS.NOTIFICATION_TYPES" />
          </h4>

          <div className="space-y-3">
            {/* Main Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="welcome_emails">
                  <FormattedMessage id="SETTINGS.NOTIFICATIONS" />
                </Label>
                <p className="text-sm text-gray-500">
                  <FormattedMessage id="SETTINGS.IN_APP_NOTIFICATIONS" />
                </p>
              </div>
              <Switch
                id="welcome_emails"
                checked={notificationsEnabled}
                onCheckedChange={handleMainToggle}
              />
            </div>

            {/* Push Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="password_reset">
                  <FormattedMessage id="SETTINGS.PUSH_NOTIFICATIONS_LABEL" />
                </Label>
                <p className="text-sm text-gray-500">
                  <FormattedMessage id="SETTINGS.PUSH_NOTIFICATIONS" />
                </p>
              </div>
              <Switch
                id="password_reset"
                checked={pushNotification}
                onCheckedChange={(checked) => handleToggle("push", checked)}
              />
            </div>

            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="content_notifications">
                  <FormattedMessage id="SETTINGS.EMAIL_NOTIFICATIONS_LABEL" />
                </Label>
                <p className="text-sm text-gray-500">
                  <FormattedMessage id="SETTINGS.EMAIL_NOTIFICATIONS" />
                </p>
              </div>
              <Switch
                id="content_notifications"
                checked={emailNotification}
                onCheckedChange={(checked) => handleToggle("email", checked)}
              />
            </div>
          </div>
        </div>

        {/* {message && <p className="text-sm text-green-600">{message}</p>} */}
        <p className={`text-sm ${message.toLowerCase().includes("success") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>


        <div className="flex items-center gap-3 pt-4">
          <Button className="flex items-center gap-2" onClick={handleSave} disabled={notificationLoading}>
            <Save className="w-4 h-4" />
            {notificationLoading ? <FormattedMessage id="SETTINGS.SAVING" /> : <FormattedMessage id="SETTINGS.SAVE_SETTINGS" />}
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleReset}
            disabled={notificationLoading}
          >
            <RefreshCw className="w-4 h-4" />
            <FormattedMessage id="SETTINGS.RESET_TO_DEFAULT" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { NotificationsEmail };


