// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Button } from '@/components/ui/button';
// import { UserRound } from 'lucide-react';

// const EditProfileCard = ({ user }: { user: any }) => {

//     const firstName = user?.first_name || '';
//   const lastName = user?.last_name || '';
//   const email = user?.email || '';

//   return (
//     <Card id="edit_profile" className='bg-white/40 dark:bg-gray-100 '>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <UserRound className="w-5 h-5" />
//           Edit Profile
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-2">
//             <Label htmlFor="first_name">First Name</Label>
//             <Input id="first_name" placeholder="First name"defaultValue={firstName} />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="last_name">Last Name</Label>
//             <Input id="last_name" placeholder="Last name" defaultValue={lastName} />
//           </div>
//           <div className="space-y-2 md:col-span-2">
//             <Label htmlFor="email">Email</Label>
//             <Input id="email" type="email" placeholder="name@email.com" defaultValue={email}  />
//           </div>
//         </div>

//         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
//           <Button className="w-full sm:w-auto">Update Profile</Button>
//           <Button variant="ghost" className="text-red-500 hover:text-red-600 w-full sm:w-auto text-sm">
//             <span className="hidden sm:inline">Delete account permanently</span>
//             <span className="sm:hidden">Delete account</span>
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export { EditProfileCard };






import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UserRound } from 'lucide-react';
import { useSettingEdit } from '../Provider/SettingeEditProvider';
import { useAuthContext } from "@/auth";
import DeleteAccountPopUp from "@/components/deletAccoutPopup/deleteAccountPopUp";



const EditProfileCard = () => {
  const { user, updateProfile, profileLoading } = useSettingEdit();
  const { currentUser } = useAuthContext();
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // const [firstName, setFirstName] = useState(user?.first_name || '');
  // const [lastName, setLastName] = useState(user?.last_name || '');
  // const [email, setEmail] = useState(user?.email || '');

  const [firstName, setFirstName] = useState(
    user?.first_name || currentUser?.first_name || currentUser?.first_name?.split(" ")[0] || ""
  );
  const [lastName, setLastName] = useState(
    user?.last_name || currentUser?.last_name || currentUser?.first_name?.split(" ")[1] || ""
  );
  const [email, setEmail] = useState(
    user?.email || currentUser?.email || ""
  );


  const [message, setMessage] = useState('');

  const handleUpdate = async () => {
    const res = await updateProfile({
      first_name: firstName,
      last_name: lastName,
      email: email,
    });

    setMessage(res.message);
    if (res.success) {
      // Optional success UI feedback
      setTimeout(() => setMessage(''), 3000);
    }
  };

  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser?.first_name || currentUser?.first_name?.split(" ")[0] || "");
      setLastName(currentUser?.last_name || currentUser?.first_name?.split(" ")[1] || "");
      setEmail(currentUser?.email || "");
    }
  }, [currentUser]);

  return (
    <Card id="edit_profile" className='bg-white/40 dark:bg-gray-100'>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserRound className="w-5 h-5" />
          Edit Profile
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              value={firstName}
              maxLength={20}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              value={lastName}
              maxLength={20}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@email.com"
              disabled
            />
          </div>
        </div>

        {message && (
          <p className="text-sm text-green-600">{message}</p>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <Button onClick={handleUpdate} disabled={profileLoading} className="w-full sm:w-auto">
            {profileLoading ? "Updating..." : "Update Profile"}
          </Button>

          <Button variant="ghost"
            onClick={() => setShowDeletePopup(true)}
            className="text-red-500 hover:text-red-600 w-full sm:w-auto text-sm">
            <span className="hidden sm:inline">Delete account permanently</span>
            <span className="sm:hidden">Delete account</span>
          </Button>
        </div>
      </CardContent>
      {showDeletePopup && (
        <DeleteAccountPopUp onClose={() => setShowDeletePopup(false)} />
      )}

    </Card>
  );
};

export { EditProfileCard };
