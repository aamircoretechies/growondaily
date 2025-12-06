// import { useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { toAbsoluteUrl } from '@/utils';
// import { Menu, MenuItem, MenuToggle, KeenIcon } from '@/components';
// import { DropdownUser } from '@/partials/dropdowns/user';
// import { DropdownNotifications } from '@/partials/dropdowns/notifications';
// import { DropdownApps } from '@/partials/dropdowns/apps';
// import { useLanguage } from '@/i18n';

// const HeaderTopbar = () => {
//   const itemChatRef = useRef<any>(null);
//   const itemUserRef = useRef<any>(null);
//   const itemNotificationsRef = useRef<any>(null);
//   const { isRTL } = useLanguage();

//   const handleDropdownChatShow = () => {
//     window.dispatchEvent(new Event('resize'));
//   };

//   return (
//     <div className="flex items-center gap-2 lg:gap-3.5">
//       {/* <Link to="/account/members/team-members" className="btn btn-sm btn-light">
//         <KeenIcon icon="users" />
//         Add <span className="hidden md:inline">Teammate</span>
//       </Link> */}

//       <div className="flex items-center gap-1">
//         {/* <Menu>
//           <MenuItem
//             ref={itemNotificationsRef}
//             toggle="dropdown"
//             trigger="click"
//             dropdownProps={{
//               placement: isRTL() ? 'bottom-start' : 'bottom-end',
//               modifiers: [
//                 {
//                   name: 'offset',
//                   options: {
//                     offset: isRTL() ? [0, 10] : [115, 10] 
//                   }
//                 }
//               ]
//             }}
//           >
//             <MenuToggle className="btn btn-icon btn-icon-lg size-9 text-gray-600 hover:text-primary dropdown-open:text-primary">
//               <KeenIcon icon="notification-status" />
//             </MenuToggle>
//             {DropdownNotifications({ menuTtemRef: itemNotificationsRef })}
//           </MenuItem>
//         </Menu> */}

//        {/*  <Menu>
//           <MenuItem
//             ref={itemChatRef}
//             onShow={handleDropdownChatShow}
//             toggle="dropdown"
//             trigger="click"
//             dropdownProps={{
//               placement: isRTL() ? 'bottom-start' : 'bottom-end',
//               modifiers: [
//                 {
//                   name: 'offset',
//                   options: {
//                     offset: isRTL() ? [0, 10] : [60, 10] // [skid, distance]
//                   }
//                 }
//               ]
//             }}
//           >
//             <MenuToggle className="btn btn-icon btn-icon-lg size-9 text-gray-600 hover:text-primary dropdown-open:text-primary">
//               <KeenIcon icon="setting-2" className="text-gray-600" />
//             </MenuToggle>

//             {DropdownApps()}
//           </MenuItem>
//         </Menu> */}
//       </div>

//       <Menu>
//         <MenuItem
//           ref={itemUserRef}
//           toggle="dropdown"
//           trigger="click"
//           dropdownProps={{
//             placement: isRTL() ? 'bottom-start' : 'bottom-end',
//             modifiers: [
//               {
//                 name: 'offset',
//                 options: {
//                   offset: [5, 10] // [skid, distance]
//                 }
//               }
//             ]
//           }}
//         >
//           <MenuToggle className="btn btn-icon rounded-full">
//             <img
//               className="size-7 rounded-full justify-center border border-gray-500 shrink-0"
//               src={toAbsoluteUrl('/media/avatars/gray/5.png')}
//               alt=""
//             />
//           </MenuToggle>
//           {DropdownUser({ menuItemRef: itemUserRef })}
//         </MenuItem>
//       </Menu>
//     </div>
//   );
// };

// export { HeaderTopbar };












import { useEffect, useRef, useState } from 'react';
import { toAbsoluteUrl } from '@/utils';
import { Menu, MenuItem, MenuToggle } from '@/components';
import { DropdownUser } from '@/partials/dropdowns/user';
import { useLanguage } from '@/i18n';
import { useAuthContext } from "@/auth";

const HeaderTopbar = () => {
  const itemUserRef = useRef<any>(null);
  const { isRTL } = useLanguage();
  const { currentUser } = useAuthContext();

  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    // jab bhi profile picture change ho → re-render hoga
    setRefresh(prev => prev + 1);
  }, [currentUser?.profile_picture]);

  // Construct image URL with proper fallback
  const getImageURL = () => {
    if (!currentUser?.profile_picture) {
      return toAbsoluteUrl("/media/avatars/300-2.png");
    }

    const profilePic = currentUser.profile_picture;
    
    // If it's already a full URL (starts with http:// or https://), use it directly
    if (profilePic.startsWith('http://') || profilePic.startsWith('https://')) {
      return profilePic;
    }

    // If it starts with /, it's already a path, just prepend the API URL
    if (profilePic.startsWith('/')) {
      return `${import.meta.env.VITE_APP_API_URL}${profilePic}`;
    }

    // Otherwise, assume it needs the uploads path
    return `${import.meta.env.VITE_APP_API_URL}/uploads/profile-pictures/${profilePic}`;
  };

  const imageURL = getImageURL();

  return (
    <div className="flex items-center gap-2 lg:gap-3.5">

      <Menu>
        <MenuItem
          ref={itemUserRef}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
          }}
        >
          <MenuToggle className="btn btn-icon rounded-full">
            <img
              key={refresh} // image refresh force hoga
              className="size-7 rounded-full justify-center border border-gray-500 shrink-0"
              src={imageURL}
              alt="user"
              onError={(e) => {
                // Fallback to default avatar if image fails to load due to CORS/CORP
                // This happens when backend doesn't have proper CORS headers
                e.currentTarget.src = toAbsoluteUrl("/media/avatars/300-2.png");
                e.currentTarget.onerror = null; // Prevent infinite loop
              }}
            />
          </MenuToggle>

          {DropdownUser({ menuItemRef: itemUserRef })}
        </MenuItem>
      </Menu>

    </div>
  );
};

export { HeaderTopbar };
