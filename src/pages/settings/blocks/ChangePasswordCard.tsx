import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { LockKeyhole } from 'lucide-react';

const ChangePasswordCard = () => {
  return (
    <Card id="change_password" className='bg-white/40 dark:bg-gray-100 '>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LockKeyhole className="w-5 h-5" />
          Change Password
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="w-full max-w-lg space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current_password">Current Password</Label>
            <Input id="current_password" type="password" placeholder="Current Password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new_password">New Password</Label>
            <Input id="new_password" type="password" placeholder="New Password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm_password">Retype New Password</Label>
            <Input id="confirm_password" type="password" placeholder="Retype New Password" />
          </div>
        </div>

        <div className="pt-2">
          <Button>Update</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { ChangePasswordCard };


