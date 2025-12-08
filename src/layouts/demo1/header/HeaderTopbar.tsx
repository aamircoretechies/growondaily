import { useRef, useState } from 'react';
// import { KeenIcon } from '@/components/keenicons';
import { toAbsoluteUrl } from '@/utils';
import { Menu, MenuItem, MenuToggle } from '@/components';
import { DropdownUser } from '@/partials/dropdowns/user';
import { DropdownNotifications } from '@/partials/dropdowns/notifications';
import { DropdownApps } from '@/partials/dropdowns/apps';
import { DropdownChat } from '@/partials/dropdowns/chat';
import { ModalSearch } from '@/partials/modals/search/ModalSearch';
import { useLanguage } from '@/i18n';
import { useAuthContext } from "@/auth";



const HeaderTopbar = () => {
  const { isRTL } = useLanguage();
  const itemChatRef = useRef<any>(null);
  const itemAppsRef = useRef<any>(null);
  const itemUserRef = useRef<any>(null);
  const itemNotificationsRef = useRef<any>(null);
  const { currentUser } = useAuthContext();


  const handleShow = () => {
    window.dispatchEvent(new Event('resize'));
  };

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const handleOpen = () => setSearchModalOpen(true);
  const handleClose = () => {
    setSearchModalOpen(false);
  };

  // Reuse same image URL logic as demo5 header
  const getImageURL = () => {
    if (!currentUser?.profile_picture) {
      return toAbsoluteUrl("/media/avatars/300-2.png");
    }

    const profilePic = currentUser.profile_picture;
    console.log("HeaderTopbar profile_picture ->", profilePic);

    // Full URL already
    if (profilePic.startsWith("http://") || profilePic.startsWith("https://")) {
      console.log("HeaderTopbar using full URL ->", profilePic);
      return profilePic;
    }

    // Path starting with /
    if (profilePic.startsWith("/")) {
      const url = `${import.meta.env.VITE_APP_API_URL}${profilePic}`;
      console.log("HeaderTopbar computed image URL (path) ->", url);
      return url;
    }

    // Just filename
    const url = `${import.meta.env.VITE_APP_API_URL}/uploads/profile-pictures/${profilePic}`;
    console.log("HeaderTopbar computed image URL (filename) ->", url);
    return url;
  };

  const imageURL = getImageURL();

  return (
    <div className="flex items-center gap-2 lg:gap-3.5  ml-auto">
      {/* <button
        onClick={handleOpen}
        className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-light hover:text-primary text-gray-500"
      >
        <KeenIcon icon="magnifier" />
      </button> */}
      {/* <ModalSearch open={searchModalOpen} onOpenChange={handleClose} /> */}

      {/* <Menu>
        <MenuItem
          ref={itemChatRef}
          onShow={handleShow}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: isRTL() ? [-170, 10] : [170, 10]
                }
              }
            ]
          }}
        >
          <MenuToggle className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500">
            <KeenIcon icon="messages" />
          </MenuToggle>

          {DropdownChat({ menuTtemRef: itemChatRef })}
        </MenuItem>
      </Menu> */}

      {/* <Menu>
        <MenuItem
          ref={itemAppsRef}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: isRTL() ? [-10, 10] : [10, 10]
                }
              }
            ]
          }}
        >
          <MenuToggle className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500">
            <KeenIcon icon="element-11" />
          </MenuToggle>

          {DropdownApps()}
        </MenuItem>
      </Menu> */}

      <Menu>
        <MenuItem
          ref={itemNotificationsRef}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: isRTL() ? [-70, 10] : [70, 10] // [skid, distance]
                }
              }
            ]
          }}
        >
          <MenuToggle className="btn btn-icon btn-icon-lg relative cursor-pointer size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500">
            {/* <KeenIcon icon="notification-status" /> */}
          </MenuToggle>
          {/* {DropdownNotifications({ menuTtemRef: itemNotificationsRef })} */}
        </MenuItem>
      </Menu>

      <Menu>
        <MenuItem
          ref={itemUserRef}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: isRTL() ? [-20, 10] : [20, 10] // [skid, distance]
                }
              }
            ]
          }}
        >
          <MenuToggle className="btn btn-icon rounded-full">
            {/* <img
              className="size-9 rounded-full border-2 border-success shrink-0"
              src={toAbsoluteUrl('/media/avatars/300-2.png')}
              alt=""
            /> */}

            <img
              className="size-9 rounded-full border-2 border-success shrink-0"
              // src={
              //   currentUser?.profile_picture
              //     ? `/uploads/profile-pictures/${currentUser.profile_picture}`
              //     : toAbsoluteUrl("/media/avatars/300-2.png")
              // }
              src={imageURL}
              alt=""
              onError={(e) => {
                e.currentTarget.src = toAbsoluteUrl("/media/avatars/300-2.png");
                e.currentTarget.onerror = null;
              }}
            />

          </MenuToggle>
          {/* {DropdownUser({ menuItemRef: itemUserRef })} */}
        </MenuItem>
      </Menu>
    </div>
  );
};

export { HeaderTopbar };
