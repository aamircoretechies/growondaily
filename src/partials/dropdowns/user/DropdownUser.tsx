import { ChangeEvent, Fragment, useRef, useEffect, useState } from 'react';
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
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    // Force re-render when profile picture changes
    setRefresh(prev => prev + 1);
  }, [currentUser?.profile_picture]);

  useEffect(() => {
    const handleScroll = () => {
      if (menuItemRef.current && menuItemRef.current.hide) {
        menuItemRef.current.hide();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [menuItemRef]);

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
    // Build image URL similar to header topbar (handles filename, path, or full URL)
    const getImageURL = () => {
      console.log("DropdownUser profile_picture ->", currentUser?.profile_picture);
      if (!currentUser?.profile_picture) {
        return toAbsoluteUrl("/media/avatars/300-2.png");
      }

      const profilePic = currentUser.profile_picture;

      // Already a full URL
      if (profilePic.startsWith("http://") || profilePic.startsWith("https://")) {
        return profilePic;
      }

      // Starts with / => treat as path from API base URL
      if (profilePic.startsWith("/")) {
        const url = `${import.meta.env.VITE_APP_API_URL}${profilePic}`;
        console.log("DropdownUser computed image URL (path) ->", url);
        return url;
      }

      // Otherwise assume just filename that lives under uploads/profile-pictures
      const url = `${import.meta.env.VITE_APP_API_URL}/uploads/profile-pictures/${profilePic}`;
      console.log("DropdownUser computed image URL (filename) ->", url);
      return url;
    };

    const imageURL = getImageURL();

    return (
      <div className="flex items-center justify-between px-5 py-1.5 gap-1.5">
        <div className="flex items-center gap-2">

          {/* CLICKABLE IMAGE (Upload trigger) */}
          <img
            key={refresh}
            onClick={() => fileInputRef.current?.click()}
            className="size-9 rounded-full border-2 border-success cursor-pointer"
            src={imageURL}
            alt=""
            onError={(e) => {
              // Fallback to default avatar if URL is invalid or blocked
              e.currentTarget.src = toAbsoluteUrl("/media/avatars/300-2.png");
              e.currentTarget.onerror = null;
            }}
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
            {/* <Link
              to="/account"
              className="text-sm text-gray-800 hover:text-primary font-semibold leading-none truncate"
            >
              {currentUser?.first_name || "User"}
            </Link> */}
            <span
              className="text-sm text-gray-800 font-semibold leading-none truncate cursor-default"
            >
              {currentUser?.first_name || "User"}
            </span>

            <a
              href={`mailto:${currentUser?.email}`}
              className="text-xs text-gray-600 hover:text-primary font-medium truncate pt-[2px]"
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
