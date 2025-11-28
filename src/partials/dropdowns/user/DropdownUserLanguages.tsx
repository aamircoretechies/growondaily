// import { FormattedMessage } from 'react-intl';
// import { KeenIcon } from '@/components';
// import { MenuItem, MenuLink, MenuTitle, MenuIcon, MenuBadge, MenuSub } from '@/components/menu';
// import clsx from 'clsx';
// import { I18N_LANGUAGES, TLanguage, useLanguage } from '@/i18n';

// interface IDropdownUserLanguagesProps {
//   menuItemRef: any;
// }

// const DropdownUserLanguages = ({ menuItemRef }: IDropdownUserLanguagesProps) => {
//   const { currentLanguage, changeLanguage } = useLanguage();
//   const { isRTL } = useLanguage();

//   const handleLanguage = (lang: TLanguage) => {
//     changeLanguage(lang);

//     if (menuItemRef.current) {
//       menuItemRef.current.hide(); // Call the closeMenu method to hide the submenu
//     }
//   };

//   const buildItems = () => {
//     return I18N_LANGUAGES.map((item, index) => (
//       <MenuItem
//         key={index}
//         className={clsx(item.code === currentLanguage.code && 'active')}
//         onClick={() => {
//           handleLanguage(item);
//         }}
//       >
//         <MenuLink className="h-10">
//           <MenuIcon>
//             <img src={item.flag} className="inline-block size-4 rounded-full" alt={item.label} />
//           </MenuIcon>
//           <MenuTitle>{item.label}</MenuTitle>
//           {item.code === currentLanguage.code && (
//             <MenuBadge>
//               <KeenIcon icon="check-circle" style="solid" className="text-success text-base" />
//             </MenuBadge>
//           )}
//         </MenuLink>
//       </MenuItem>
//     ));
//   };

//   return (
//     <MenuItem
//       toggle="dropdown"
//       trigger="hover"
//       dropdownProps={{
//         placement: isRTL() ? 'left-start' : 'right-start',
//         modifiers: [
//           {
//             name: 'offset',
//             options: {
//               offset: isRTL() ? [-10, 0] : [10, 0] // [skid, distance]
//             }
//           }
//         ]
//       }}
//     >
//       <MenuLink>
//         <MenuIcon>
//           <KeenIcon icon="icon" />
//         </MenuIcon>
//         <MenuTitle>
//           <FormattedMessage id="USER.MENU.LANGUAGE" />
//         </MenuTitle>
//         <div className="flex items-center gap-1.5 rounded-md border border-gray-300 text-gray-600 p-1.5 text-2xs font-medium shrink-0">
//           {currentLanguage.label}
//           <img
//             src={currentLanguage.flag}
//             className="inline-block size-3.5 rounded-full"
//             alt="{currentLanguage.label}"
//           />
//         </div>
//       </MenuLink>
//       <MenuSub className="menu-default light:border-gray-300 w-[190px]">{buildItems()}</MenuSub>
//     </MenuItem>
//   );
// };

// export { DropdownUserLanguages };



















import { FormattedMessage } from "react-intl";
import { KeenIcon } from "@/components";
import { MenuItem, MenuLink, MenuTitle, MenuIcon, MenuBadge, MenuSub } from "@/components/menu";
import clsx from "clsx";
import { I18N_LANGUAGES, TLanguage, useLanguage } from "@/i18n";
import { useAuthContext } from "@/auth";
import { toast } from "sonner";

interface IDropdownUserLanguagesProps {
  menuItemRef: any;
}

const DropdownUserLanguages = ({ menuItemRef }: IDropdownUserLanguagesProps) => {
  const { currentLanguage, changeLanguage: changeFrontendLanguage, isRTL } = useLanguage();
  const { changeLanguage: changeBackendLanguage } = useAuthContext(); 

  const handleLanguageChange = async (lang: TLanguage) => {
    try {
      changeFrontendLanguage(lang);

      await changeBackendLanguage(lang.code); // lang.code like "en" or "nl"

      toast.success(`Language changed to ${lang.label}`);

      if (menuItemRef.current) {
        menuItemRef.current.hide();
      }

    } catch (error) {
      console.error("Language change failed:", error);
      toast.error("Failed to change language");
    }
  };

  const buildItems = () => {
    return I18N_LANGUAGES.map((item, index) => (
      <MenuItem
        key={index}
        className={clsx(item.code === currentLanguage.code && "active")}
        onClick={() => handleLanguageChange(item)}
      >
        <MenuLink className="h-10">
          <MenuIcon>
            <img src={item.flag} className="inline-block size-4 rounded-full" alt={item.label} />
          </MenuIcon>

          <MenuTitle>{item.label}</MenuTitle>

          {item.code === currentLanguage.code && (
            <MenuBadge>
              <KeenIcon icon="check-circle" style="solid" className="text-success text-base" />
            </MenuBadge>
          )}
        </MenuLink>
      </MenuItem>
    ));
  };

  return (
    <MenuItem
      toggle="dropdown"
      trigger="hover"
      dropdownProps={{
        placement: isRTL() ? "left-start" : "right-start",
        modifiers: [
          {
            name: "offset",
            options: {
              offset: isRTL() ? [50, 0] : [-50, 0],
            },
          },
        ],
      }}
    >
      <MenuLink>
        <MenuIcon>
          <KeenIcon icon="earth" />
        </MenuIcon>

        <MenuTitle>
          <FormattedMessage id="USER.MENU.LANGUAGE" />
        </MenuTitle>

        <div className="flex items-center gap-1.5 rounded-md border border-gray-300 text-gray-600 p-1.5 text-2xs font-medium shrink-0">
          {currentLanguage.label}
          <img
            src={currentLanguage.flag}
            className="inline-block size-3.5 rounded-full"
            alt={currentLanguage.label}
          />
        </div>
      </MenuLink>

      <MenuSub className="menu-default light:border-gray-300 w-[190px]">
        {buildItems()}
      </MenuSub>
    </MenuItem>
  );
};

export { DropdownUserLanguages };
