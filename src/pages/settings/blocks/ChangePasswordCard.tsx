// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Button } from '@/components/ui/button';
// import { LockKeyhole } from 'lucide-react';

// const ChangePasswordCard = () => {
//   return (
//     <Card id="change_password" className='bg-white/40 dark:bg-gray-100 '>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <LockKeyhole className="w-5 h-5" />
//           Change Password
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         <div className="w-full max-w-lg space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="current_password">Current Password</Label>
//             <Input id="current_password" type="password" placeholder="Current Password" />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="new_password">New Password</Label>
//             <Input id="new_password" type="password" placeholder="New Password" />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="confirm_password">Retype New Password</Label>
//             <Input id="confirm_password" type="password" placeholder="Retype New Password" />
//           </div>
//         </div>

//         <div className="pt-2">
//           <Button>Update</Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export { ChangePasswordCard };













import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { LockKeyhole } from 'lucide-react';
import { useSettingEdit } from '../Provider/SettingeEditProvider';
import { Alert, KeenIcon } from '@/components';
import { FormattedMessage, useIntl } from 'react-intl';

const ChangePasswordCard = () => {
  const { formatMessage } = useIntl();
  const { changePassword, passwordLoading } = useSettingEdit();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);



  // const handlePasswordChange = async () => {

  //   if (!currentPassword.trim()) {
  //     setMessage("Current password is required");
  //     return;
  //   }

  //   if (newPassword.length > 16) {
  //     setMessage("Password cannot be more than 16 characters");
  //     return;
  //   }

  //   if (confirmPassword.length > 16) {
  //     setMessage("Confirm password cannot be more than 16 characters");
  //     return;
  //   }

  //   if (newPassword !== confirmPassword) {
  //     setMessage("New passwords do not match");
  //     return;
  //   }

  //   const res = await changePassword({
  //     current_password: currentPassword,
  //     new_password: newPassword,
  //     confirm_password: confirmPassword,
  //   });
  //   console.log("FULL PASSWORD API RESPONSE =>", res);
  //   console.log("ERRORS =>", res.errors);



  //   if (!res || res.success === false || res.status === 0) {
  //     setMessage(res.message || "Current password is incorrect");
  //     return;
  //   }
  //   setMessage(res.message);

  //   if (res.success) {
  //     setCurrentPassword("");
  //     setNewPassword("");
  //     setConfirmPassword("");

  //     setTimeout(() => setMessage(""), 3000);
  //   }
  //   console.log("PASSWORD API RESPONSE:", res);

  // };

  const handlePasswordChange = async () => {

    // --- FRONTEND VALIDATIONS ---
    if (!currentPassword.trim()) {
      setIsError(true);
      setMessage(formatMessage({ id: 'PASSWORD.CURRENT_REQUIRED' }));
      return;
    }

    if (newPassword.length > 16) {
      setIsError(true);
      setMessage(formatMessage({ id: 'VALIDATION.PASSWORD_MAX_LENGTH' }));
      return;
    }

    if (confirmPassword.length > 16) {
      setIsError(true);
      setMessage(formatMessage({ id: 'VALIDATION.PASSWORD_MAX_LENGTH' }));
      return;
    }

    if (newPassword !== confirmPassword) {
      setIsError(true);
      setMessage(formatMessage({ id: 'PASSWORD.PASSWORDS_DONT_MATCH' }));
      return;
    }

    // --- API CALL ---
    const res = await changePassword({
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });

    console.log("FULL PASSWORD API RESPONSE =>", res);

    // --- API ERROR ---
    if (!res || res.success === false || res.status === 0) {
      setIsError(true);
      setMessage(res.message || formatMessage({ id: 'PASSWORD.CURRENT_MISMATCH' }));
      return;
    }

    // --- SUCCESS ---
    setIsError(false);
    setMessage(formatMessage({ id: 'PASSWORD.UPDATE_SUCCESS' }));

    if (res.success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => setMessage(""), 3000);
    }
  };



  return (
    <Card id="change_password" className='bg-white/40 dark:bg-gray-100'>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LockKeyhole className="w-5 h-5" />
          <FormattedMessage id="PASSWORD.CHANGE_PASSWORD" />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="w-full max-w-lg space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current_password">
              <FormattedMessage id="PASSWORD.CURRENT_PASSWORD" />
            </Label>
            {/* <Input
              id="current_password"
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            /> */}
            <div className="relative">
              <Input
                id="current_password"
                maxLength={16}
                type={showCurrent ? "text" : "password"}
                placeholder={formatMessage({ id: 'PASSWORD.CURRENT_PASSWORD' })}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />

              {/* <button
                type="button"
                className="absolute right-3 top-3 text-gray-500 hover:text-primary dark:hover:text-white transition cursor-pointer"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? (
                  <KeenIcon icon="eye-slash" className="transition text-gray-500 group-hover:text-primary dark:group-hover:text-white" />
                ) : (
                  <KeenIcon icon="eye" className="transition text-gray-500 group-hover:text-primary dark:group-hover:text-white" />
                )}
              </button> */}
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 group text-gray-500 hover:text-primary dark:hover:text-white transition cursor-pointer"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? (
                  <KeenIcon icon="eye" className="transition group-hover:text-primary dark:group-hover:text-white" />
                ) : (
                  <KeenIcon icon="eye-slash" className="transition group-hover:text-primary dark:group-hover:text-white" />
                )}
              </button>

            </div>

          </div>

          <div className="space-y-2">
            <Label htmlFor="new_password">
              <FormattedMessage id="PASSWORD.NEW_PASSWORD" />
            </Label>
            {/* <Input
              id="new_password"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            /> */}
            <div className="relative">
              <Input
                id="new_password"
                maxLength={16}
                type={showNew ? "text" : "password"}
                placeholder={formatMessage({ id: 'PASSWORD.NEW_PASSWORD' })}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              {/* <button
                type="button"
                className="absolute right-3 top-3 text-gray-500 hover:text-primary dark:hover:text-white transition cursor-pointer"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? (
                  <KeenIcon icon="eye-slash" className="transition text-gray-500 group-hover:text-primary dark:group-hover:text-white" />
                ) : (
                  <KeenIcon icon="eye" className="transition text-gray-500 group-hover:text-primary dark:group-hover:text-white" />
                )}
              </button> */}

              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 group text-gray-500 hover:text-primary dark:hover:text-white transition cursor-pointer"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? (
                  <KeenIcon icon="eye" className="transition group-hover:text-primary dark:group-hover:text-white" />
                ) : (
                  <KeenIcon icon="eye-slash" className="transition group-hover:text-primary dark:group-hover:text-white" />
                )}
              </button>

            </div>

          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm_password">
              <FormattedMessage id="PASSWORD.RETYPE_NEW_PASSWORD" />
            </Label>
            {/* <Input
              id="confirm_password"
              type="password"
              placeholder="Retype New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            /> */}
            <div className="relative">
              <Input
                id="confirm_password"
                maxLength={16}
                type={showConfirm ? "text" : "password"}
                placeholder={formatMessage({ id: 'PASSWORD.RETYPE_NEW_PASSWORD' })}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              {/* <button
                type="button"
                className="absolute right-3 top-3 text-gray-500 hover:text-primary dark:hover:text-white transition cursor-pointer"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? (
                  <KeenIcon icon="eye-slash" className="transition text-gray-500 group-hover:text-primary dark:group-hover:text-white" />
                ) : (
                  <KeenIcon icon="eye" className="transition text-gray-500 group-hover:text-primary dark:group-hover:text-white" />
                )}
              </button> */}
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 group text-gray-500 hover:text-primary dark:hover:text-white transition cursor-pointer"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? (
                  <KeenIcon icon="eye" className="transition group-hover:text-primary dark:group-hover:text-white" />
                ) : (
                  <KeenIcon icon="eye-slash" className="transition group-hover:text-primary dark:group-hover:text-white" />
                )}
              </button>

            </div>

          </div>
        </div>

        {/* {message && (
          <p className="text-sm text-green-600">{message}</p>
        )} */}
        {message && (
          <p className={`text-sm ${isError ? "text-red-600" : "text-green-600"}`}>
            {message}
          </p>
        )}


        <div className="pt-2">
          <Button onClick={handlePasswordChange} disabled={passwordLoading}>
            {passwordLoading ? <FormattedMessage id="PASSWORD.UPDATING" /> : <FormattedMessage id="PASSWORD.UPDATE" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { ChangePasswordCard };
