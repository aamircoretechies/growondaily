import { Menu, MenuItem, MenuLink, MenuTitle } from '@/components';
import { useIntl } from 'react-intl';

interface INavbarMenuItem {
  title: string;
  path: string;
  partial?: string | false;
}
interface INavbarMenuItems extends Array<INavbarMenuItem> { }

const NavbarMenu = () => {
  const { formatMessage } = useIntl();
  const items: INavbarMenuItems = [
    {
      title: formatMessage({ id: 'NAV.HOME' }),
      path: '/home',
      partial: false
    },
    {
      title: formatMessage({ id: 'NAV.REFLECTION' }),
      path: '/reflections',
      partial: '/reflections'
    },
    {
      title: formatMessage({ id: 'NAV.BIBLE' }),
      path: '/bible',
      partial: '/bible'
    },
    {
      title: formatMessage({ id: 'NAV.ASK' }),
      path: '/ask',
      partial: '/ask'
    },
    {
      title: formatMessage({ id: 'NAV.SETTINGS' }),
      path: '/settings',
      partial: '/settings'
    }
  ];

  return (
    <div className="grid">
      <div className="scrollable-x-auto">
        <Menu highlight={true} className="gap-5 lg:gap-7.5">
          {items.map((item, index) => (
            <MenuItem
              key={index}
              className="py-3.5 border-b border-b-transparent menu-item-active:border-b-gray-900"
            >
              <MenuLink path={item.path} className="gap-2.5">
                <MenuTitle className="text-nowrap font-medium text-2sm text-gray-800 menu-item-active:text-gray-900 menu-item-active:font-medium menu-link-hover:text-gray-900">
                  {item.title}
                </MenuTitle>
              </MenuLink>
            </MenuItem>
          ))}
        </Menu>
      </div>
    </div>
  );
};

export { NavbarMenu };
