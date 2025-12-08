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
