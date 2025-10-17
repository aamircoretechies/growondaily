import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UserRound } from 'lucide-react';

const EditProfileCard = () => {
  return (
    <Card id="edit_profile" className='bg-white/40 dark:bg-gray-100 '>
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
            <Input id="first_name" placeholder="First name" defaultValue="Thomas" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input id="last_name" placeholder="Last name" defaultValue="Mathew" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@email.com" defaultValue="thomas@example.com" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <Button className="w-full sm:w-auto">Update Profile</Button>
          <Button variant="ghost" className="text-red-500 hover:text-red-600 w-full sm:w-auto text-sm">
            <span className="hidden sm:inline">Delete account permanently</span>
            <span className="sm:hidden">Delete account</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { EditProfileCard };


