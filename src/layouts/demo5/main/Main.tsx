import { Fragment, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation } from 'react-router';
import { useMenuCurrentItem } from '@/components/menu';
import { useMenus } from '@/providers';
import { Container } from '@/components/container';

import { Header, Navbar, Footer } from '../';
import { Toolbar, ToolbarHeading, ToolbarActions } from '../toolbar';
import { Sidebar } from '../sidebar';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { KeenIcon } from '@/components/keenicons';

const Main = () => {
  const { pathname } = useLocation();
  const { getMenuConfig } = useMenus();
  const menuConfig = getMenuConfig('primary');
  const menuItem = useMenuCurrentItem(pathname, menuConfig);

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2025, 0, 20),
    to: addDays(new Date(2025, 0, 20), 20)
  });

  return (
    <Fragment>
      <Helmet>
        <title>{menuItem?.title}</title>
      </Helmet>
      <div className="flex grow flex-col [[data-sticky-header=on]_&]:pt-[--tw-header-height]">
        <Header />
        <Navbar />
        {pathname === '/reflections/journal' || pathname === '/reflections/bookmarks' ? (
          <div className="w-full">
            <main className="flex flex-col grow w-full">
              <Outlet />
              <Footer />
            </main>
          </div>
        ) : (
          <Container width="fixed" className="flex p-0">
            {pathname !== '/' && pathname !== '/home' && pathname !== '/reflections' && pathname !== '/settings' && pathname !== '/ask' && <Sidebar />}

            <main className={`flex flex-col grow ${(pathname === '/' || pathname === '/home' || pathname === '/reflections') ? 'w-full' : ''}`}>
              {! (pathname.includes('/') || pathname.includes('/bible') || pathname.includes('/public-profile') || pathname.includes('/reflections') || pathname.includes('/ask')) && (
                <Toolbar>
                  <ToolbarHeading />
                  <ToolbarActions>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          id="date"
                          className={cn(
                            'btn btn-sm btn-light data-[state=open]:bg-light-active',
                            !date && 'text-gray-400'
                          )}
                        >
                          <KeenIcon icon="calendar" className="me-0.5" />
                          {date?.from ? (
                            date.to ? (
                              <>
                                {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                              </>
                            ) : (
                              format(date.from, 'LLL dd, y')
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={date?.from}
                          selected={date}
                          onSelect={setDate}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                    
                  </ToolbarActions>
                </Toolbar>
              )}
              <Outlet />
              <Footer />
            </main>
          </Container>
        )}
      </div>
    </Fragment>
  );
};

export { Main };
