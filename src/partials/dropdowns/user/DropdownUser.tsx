// import { ChangeEvent, Fragment } from 'react';
// import { Link } from 'react-router-dom';
// import { FormattedMessage } from 'react-intl';
// import { useAuthContext } from '@/auth';
// import { useLanguage } from '@/i18n';
// import { toAbsoluteUrl } from '@/utils';
// import { DropdownUserLanguages } from './DropdownUserLanguages';
// import { useSettings } from '@/providers/SettingsProvider';
// import { DefaultTooltip, KeenIcon } from '@/components';
// import {MenuItem,MenuLink,MenuSub,MenuTitle,MenuSeparator,MenuArrow,MenuIcon} from '@/components/menu';
// import { useContext } from "react";
// import { AuthContext } from "@/auth/providers/JWTProvider";



// interface IDropdownUserProps {
//   menuItemRef: any;
// }

// const DropdownUser = ({ menuItemRef }: IDropdownUserProps) => {
//   const { settings, storeSettings } = useSettings();
//   const { logout } = useAuthContext();
//   const { isRTL } = useLanguage();
//   const { currentUser } = useAuthContext();


//   const handleThemeMode = (event: ChangeEvent<HTMLInputElement>) => {
//     const newThemeMode = event.target.checked ? 'dark' : 'light';

//     storeSettings({
//       themeMode: newThemeMode
//     });
//   };

//   const buildHeader = () => {
//     return (
//       <div className="flex items-center justify-between px-5 py-1.5 gap-1.5">
//         <div className="flex items-center gap-2">
//           <img
//             className="size-9 rounded-full border-2 border-success"
//             src={toAbsoluteUrl('/media/avatars/300-2.png')}
//             alt=""
//           />
//           <div className="flex flex-col gap-1.5 max-w-[140px]">
//             <Link
//               to="/account"
//               className="text-sm text-gray-800 hover:text-primary font-semibold leading-none truncate"
//             >
//               {/* Cody Fisher */}
//               {currentUser?.first_name || "User"}
//             </Link>
//             <a
//               href="mailto:c.fisher@gmail.com"
//               className="text-xs text-gray-600 hover:text-primary font-medium leading-none truncate"
//             >
//               {/* c.fisher@gmail.com */}
//               {currentUser?.email || "example@gmail.com"}
//             </a>
//           </div>
//         </div>
//        {/*  <span className="badge badge-xs badge-primary badge-outline">Admin</span> */}
//       </div>
//     );
//   };

//   const buildMenu = () => {
//     return (
//       <Fragment>
//         <MenuSeparator />
//         <div className="flex flex-col">

//           <MenuItem
//             toggle="dropdown"
//             trigger="hover"
//             dropdownProps={{
//               placement: isRTL() ? 'left-start' : 'right-start',
//               modifiers: [
//                 {
//                   name: 'offset',
//                   options: {
//                     offset: isRTL() ? [50, 0] : [-50, 0] // [skid, distance]
//                   }
//                 }
//               ]
//             }}
//           >
//             {/* <MenuLink>
//               <MenuIcon>
//                 <KeenIcon icon="setting-2" />
//               </MenuIcon>
//               <MenuTitle>
//                 <FormattedMessage id="USER.MENU.MY_ACCOUNT" />
//               </MenuTitle>
//               <MenuArrow>
//                 <KeenIcon icon="right" className="text-3xs rtl:transform rtl:rotate-180" />
//               </MenuArrow>
//             </MenuLink> */}
//             <MenuSub className="menu-default light:border-gray-300 w-[200px]] md:w-[220px]">

//               <MenuItem>
//                 <MenuLink path="/account">
//                   <MenuIcon>
//                     <KeenIcon icon="some-files" />
//                   </MenuIcon>
//                   <MenuTitle>
//                     <FormattedMessage id="USER.MENU.MY_PROFILE" />
//                   </MenuTitle>
//                 </MenuLink>
//               </MenuItem>

//               <MenuItem>
//                 <MenuLink path="/account">
//                   <MenuIcon>
//                     <KeenIcon icon="medal-star" />
//                   </MenuIcon>
//                   <MenuTitle>
//                     <FormattedMessage id="USER.MENU.SECURITY" />
//                   </MenuTitle>
//                 </MenuLink>
//               </MenuItem>


//               <MenuSeparator />
//               <MenuItem>
//                 <MenuLink path="/security">
//                   <MenuIcon>
//                     <KeenIcon icon="shield-tick" />
//                   </MenuIcon>
//                   <MenuTitle>
//                     <FormattedMessage id="USER.MENU.NOTIFICATIONS" />
//                   </MenuTitle>
//                   <label className="switch switch-sm">
//                     <input name="check" type="checkbox" checked onChange={() => {}} value="1" />
//                   </label>
//                 </MenuLink>
//               </MenuItem>
//             </MenuSub>
//           </MenuItem>

//           <DropdownUserLanguages menuItemRef={menuItemRef} />
//           <MenuSeparator />
//         </div>
//       </Fragment>
//     );
//   };

//   const buildFooter = () => {
//     return (
//       <div className="flex flex-col">
//         <div className="menu-item mb-0.5">
//           <div className="menu-link">
//             <span className="menu-icon">
//               <KeenIcon icon="moon" />
//             </span>
//             <span className="menu-title">
//               <FormattedMessage id="USER.MENU.DARK_MODE" />
//             </span>
//             <label className="switch switch-sm">
//               <input
//                 name="theme"
//                 type="checkbox"
//                 checked={settings.themeMode === 'dark'}
//                 onChange={handleThemeMode}
//                 value="1"
//               />
//             </label>
//           </div>
//         </div>

//         <div className="menu-item px-4 py-1.5">
//           <a onClick={logout} className="btn btn-sm btn-light justify-center">
//             <FormattedMessage id="USER.MENU.LOGOUT" />
//           </a>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <MenuSub
//       className="menu-default light:border-gray-300 w-[200px] md:w-[250px]"
//       rootClassName="p-0"
//     >
//       {buildHeader()}
//       {buildMenu()}
//       {buildFooter()}
//     </MenuSub>
//   );
// };

// export { DropdownUser };














import { ChangeEvent, Fragment, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useAuthContext } from '@/auth';
import { useLanguage } from '@/i18n';
import { toAbsoluteUrl } from '@/utils';
import { DropdownUserLanguages } from './DropdownUserLanguages';
import { useSettings } from '@/providers/SettingsProvider';
import { KeenIcon } from '@/components';
import { MenuItem, MenuLink, MenuSub, MenuTitle, MenuSeparator, MenuArrow, MenuIcon } from '@/components/menu';
import { toast } from "sonner";

interface IDropdownUserProps {
  menuItemRef: any;
}

const DropdownUser = ({ menuItemRef }: IDropdownUserProps) => {
  const { settings, storeSettings } = useSettings();
  const { logout, currentUser, updateProfileImage } = useAuthContext();
  const { isRTL } = useLanguage();


  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleThemeMode = (event: ChangeEvent<HTMLInputElement>) => {
    const newThemeMode = event.target.checked ? "dark" : "light";
    storeSettings({ themeMode: newThemeMode });
  };

  // const handleProfilePicChange = async (event: ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   await updateProfileImage(file);
  // };

  const handleProfilePicChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const updatedUser = await updateProfileImage(file);

    if (updatedUser) {
      toast.success("Profile picture updated!");
    } else {
      toast.error("Failed to update profile picture");
    }
  };



  const buildHeader = () => {
    const imageURL =
      currentUser?.profile_picture
        ? `${import.meta.env.VITE_APP_API_URL}/uploads/profile-pictures/${currentUser.profile_picture}`
        : toAbsoluteUrl("/media/avatars/300-2.png");
    // console.log("Uploaded Image Full URL =>", imageURL);

    return (
      <div className="flex items-center justify-between px-5 py-1.5 gap-1.5">
        <div className="flex items-center gap-2">

          {/* CLICKABLE IMAGE (Upload trigger) */}
          <img
            onClick={() => fileInputRef.current?.click()}
            className="size-9 rounded-full border-2 border-success cursor-pointer"
            src={imageURL}
            alt=""
          />

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleProfilePicChange}
          />

          <div className="flex flex-col gap-1.5 max-w-[140px]">
            <Link
              to="/account"
              className="text-sm text-gray-800 hover:text-primary font-semibold leading-none truncate"
            >
              {currentUser?.first_name || "User"}
            </Link>
            <a
              href={`mailto:${currentUser?.email}`}
              className="text-xs text-gray-600 hover:text-primary font-medium leading-none truncate"
            >
              {currentUser?.email || "example@gmail.com"}
            </a>
          </div>
        </div>
      </div>
    );
  };

  // Build Menu
  const buildMenu = () => {
    return (
      <Fragment>
        <MenuSeparator />
        <div className="flex flex-col">
          <MenuItem
            toggle="dropdown"
            trigger="hover"
            dropdownProps={{
              placement: isRTL() ? "left-start" : "right-start",
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: isRTL() ? [50, 0] : [-50, 0]
                  }
                }
              ]
            }}
          >
            <MenuSub className="menu-default light:border-gray-300 w-[200px] md:w-[220px]">
              <MenuItem>
                <MenuLink path="/account">
                  <MenuIcon>
                    <KeenIcon icon="some-files" />
                  </MenuIcon>
                  <MenuTitle>
                    <FormattedMessage id="USER.MENU.MY_PROFILE" />
                  </MenuTitle>
                </MenuLink>
              </MenuItem>

              <MenuItem>
                <MenuLink path="/account">
                  <MenuIcon>
                    <KeenIcon icon="medal-star" />
                  </MenuIcon>
                  <MenuTitle>
                    <FormattedMessage id="USER.MENU.SECURITY" />
                  </MenuTitle>
                </MenuLink>
              </MenuItem>

              <MenuSeparator />

              <MenuItem>
                <MenuLink path="/security">
                  <MenuIcon>
                    <KeenIcon icon="shield-tick" />
                  </MenuIcon>
                  <MenuTitle>
                    <FormattedMessage id="USER.MENU.NOTIFICATIONS" />
                  </MenuTitle>
                  <label className="switch switch-sm">
                    <input name="check" type="checkbox" checked onChange={() => { }} />
                  </label>
                </MenuLink>
              </MenuItem>
            </MenuSub>
          </MenuItem>

          <DropdownUserLanguages menuItemRef={menuItemRef} />
          <MenuSeparator />
        </div>
      </Fragment>
    );
  };

  // Build Footer
  const buildFooter = () => {
    return (
      <div className="flex flex-col">
        <div className="menu-item mb-0.5">
          <div className="menu-link">
            <span className="menu-icon">
              <KeenIcon icon="moon" />
            </span>
            <span className="menu-title">
              <FormattedMessage id="USER.MENU.DARK_MODE" />
            </span>
            <label className="switch switch-sm">
              <input
                name="theme"
                type="checkbox"
                checked={settings.themeMode === "dark"}
                onChange={handleThemeMode}
              />
            </label>
          </div>
        </div>

        <div className="menu-item px-4 py-1.5">
          <a onClick={logout} className="btn btn-sm btn-light justify-center">
            <FormattedMessage id="USER.MENU.LOGOUT" />
          </a>
        </div>
      </div>
    );
  };

  return (
    <MenuSub
      className="menu-default light:border-gray-300 w-[200px] md:w-[250px]"
      rootClassName="p-0"
    >
      {buildHeader()}
      {buildMenu()}
      {buildFooter()}
    </MenuSub>
  );
};

export { DropdownUser };
