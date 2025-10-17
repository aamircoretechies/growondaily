import {
  Menu,
  MenuItem,
  MenuLink,
  MenuTitle,
  MenuToggle,
  KeenIcon,
  MenuSub,
  MenuIcon
} from '@/components';
import { useLanguage } from '@/i18n';
import { useState, useMemo } from 'react';
import { MakeNote } from '@/components';

interface IDashboardDropdownItem {
  title: string;
  path: string;
  icon: string;
  active?: boolean;
}
interface IDashboardDropdownItems extends Array<IDashboardDropdownItem> {}

interface IMenuItem {
  title: string;
  path: string;
  icon: string;
  active?: boolean;
}

interface IDashboardMenuItem {
  title: string;
  children: IMenuItem[];
}
interface IDashboardMenuItems extends Array<IDashboardMenuItem> {}

const SidebarMenuDashboard = () => {
  const { isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [chapterSearchTerm, setChapterSearchTerm] = useState('');
  const [verseSearchTerm, setVerseSearchTerm] = useState('');
  const [deepStudyActive, setDeepStudyActive] = useState(false);
  const [showMakeNote, setShowMakeNote] = useState(false);
  const dropdownItems: IDashboardDropdownItems = [
    // Old Testament
{ title: 'Genesis', path: '', icon: 'calendar', active: true },
{ title: 'Exodus', path: '', icon: 'calendar', active: true },
{ title: 'Leviticus', path: '', icon: 'calendar', active: true },
{ title: 'Numbers', path: '', icon: 'calendar', active: true },
{ title: 'Deuteronomy', path: '', icon: 'calendar', active: true },
{ title: 'Joshua', path: '', icon: 'calendar', active: true },
{ title: 'Judges', path: '', icon: 'calendar', active: true },
{ title: 'Ruth', path: '', icon: 'calendar', active: true },
{ title: '1 Samuel', path: '', icon: 'calendar', active: true },
{ title: '2 Samuel', path: '', icon: 'calendar', active: true },
{ title: '1 Kings', path: '', icon: 'calendar', active: true },
{ title: '2 Kings', path: '', icon: 'calendar', active: true },
{ title: '1 Chronicles', path: '', icon: 'calendar', active: true },
{ title: '2 Chronicles', path: '', icon: 'calendar', active: true },
{ title: 'Ezra', path: '', icon: 'calendar', active: true },
{ title: 'Nehemiah', path: '', icon: 'calendar', active: true },
{ title: 'Esther', path: '', icon: 'calendar', active: true },
{ title: 'Job', path: '', icon: 'calendar', active: true },
{ title: 'Psalms', path: '', icon: 'calendar', active: true },
{ title: 'Proverbs', path: '', icon: 'calendar', active: true },
{ title: 'Ecclesiastes', path: '', icon: 'calendar', active: true },
{ title: 'Song of Solomon', path: '', icon: 'calendar', active: true },
{ title: 'Isaiah', path: '', icon: 'calendar', active: true },
{ title: 'Jeremiah', path: '', icon: 'calendar', active: true },
{ title: 'Lamentations', path: '', icon: 'calendar', active: true },
{ title: 'Ezekiel', path: '', icon: 'calendar', active: true },
{ title: 'Daniel', path: '', icon: 'calendar', active: true },
{ title: 'Hosea', path: '', icon: 'calendar', active: true },
{ title: 'Joel', path: '', icon: 'calendar', active: true },
{ title: 'Amos', path: '', icon: 'calendar', active: true },
{ title: 'Obadiah', path: '', icon: 'calendar', active: true },
{ title: 'Jonah', path: '', icon: 'calendar', active: true },
{ title: 'Micah', path: '', icon: 'calendar', active: true },
{ title: 'Nahum', path: '', icon: 'calendar', active: true },
{ title: 'Habakkuk', path: '', icon: 'calendar', active: true },
{ title: 'Zephaniah', path: '', icon: 'calendar', active: true },
{ title: 'Haggai', path: '', icon: 'calendar', active: true },
{ title: 'Zechariah', path: '', icon: 'calendar', active: true },
{ title: 'Malachi', path: '', icon: 'calendar', active: true },

// New Testament
{ title: 'Matthew', path: '', icon: 'calendar', active: true },
{ title: 'Mark', path: '', icon: 'calendar', active: true },
{ title: 'Luke', path: '', icon: 'calendar', active: true },
{ title: 'John', path: '', icon: 'calendar', active: true },
{ title: 'Acts', path: '', icon: 'calendar', active: true },
{ title: 'Romans', path: '', icon: 'calendar', active: true },
{ title: '1 Corinthians', path: '', icon: 'calendar', active: true },
{ title: '2 Corinthians', path: '', icon: 'calendar', active: true },
{ title: 'Galatians', path: '', icon: 'calendar', active: true },
{ title: 'Ephesians', path: '', icon: 'calendar', active: true },
{ title: 'Philippians', path: '', icon: 'calendar', active: true },
{ title: 'Colossians', path: '', icon: 'calendar', active: true },
{ title: '1 Thessalonians', path: '', icon: 'calendar', active: true },
{ title: '2 Thessalonians', path: '', icon: 'calendar', active: true },
{ title: '1 Timothy', path: '', icon: 'calendar', active: true },
{ title: '2 Timothy', path: '', icon: 'calendar', active: true },
{ title: 'Titus', path: '', icon: 'calendar', active: true },
{ title: 'Philemon', path: '', icon: 'calendar', active: true },
{ title: 'Hebrews', path: '', icon: 'calendar', active: true },
{ title: 'James', path: '', icon: 'calendar', active: true },
{ title: '1 Peter', path: '', icon: 'calendar', active: true },
{ title: '2 Peter', path: '', icon: 'calendar', active: true },
{ title: '1 John', path: '', icon: 'calendar', active: true },
{ title: '2 John', path: '', icon: 'calendar', active: true },
{ title: '3 John', path: '', icon: 'calendar', active: true },
{ title: 'Jude', path: '', icon: 'calendar', active: true },
{ title: 'Revelation', path: '', icon: 'calendar', active: true },

  ];

  // Filter dropdown items based on search term
  const filteredDropdownItems = useMemo(() => {
    if (!searchTerm) return dropdownItems;
    return dropdownItems.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [dropdownItems, searchTerm]);

  // Generate chapter items (1-150)
  const chapterItems: IDashboardDropdownItems = Array.from({ length: 150 }, (_, index) => ({
    title: `Chapter ${index + 1}`,
    path: `/bible-content/psalm-23/chapter-${index + 1}`,
    icon: 'calendar',
    active: false
  }));

  // Filter chapter items based on search term
  const filteredChapterItems = useMemo(() => {
    if (!chapterSearchTerm) return chapterItems;
    return chapterItems.filter(item =>
      item.title.toLowerCase().includes(chapterSearchTerm.toLowerCase())
    );
  }, [chapterItems, chapterSearchTerm]);

  // Generate verse items (1-176)
  const verseItems: IDashboardDropdownItems = Array.from({ length: 176 }, (_, index) => ({
    title: `Verse ${index + 1}`,
    path: `/bible-content/psalm-23/verse-${index + 1}`,
    icon: 'calendar',
    active: false
  }));

  // Filter verse items based on search term
  const filteredVerseItems = useMemo(() => {
    if (!verseSearchTerm) return verseItems;
    return verseItems.filter(item =>
      item.title.toLowerCase().includes(verseSearchTerm.toLowerCase())
    );
  }, [verseItems, verseSearchTerm]);

  const menuItems: IDashboardMenuItems = [
    {
      title: 'Options',
      children: [
        {
          title: 'Bookmark',
          icon: 'bookmark',
          path: '',
          active: false
        },
        {
          title: 'Make Note',
          icon: 'pencil',
          path: '',
          active: false
        },
        {
          title: 'Share',
          icon: 'share',
          path: '',
          active: false
        },
       /*  {
          title: 'Deep Study',
          icon: 'book-open',
          path: '',
          active: deepStudyActive
        } */
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-1 px-2.5">
      {/* Bible Books Section */}
      <div className="px-0 py-1">
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Bible Books</h3>
      </div>
      <Menu highlight={true} className="menu-default w-full p-0">
        <MenuItem
          className="w-full"
          toggle="dropdown"
          trigger="hover"
          dropdownProps={{
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 0] // [skid, distance]
                }
              }
            ]
          }}
        >
          <MenuToggle className="w-full btn btn-light btn-sm justify-between flex-nowrap">
            <span className="flex items-center gap-1.5">
              Psalm
            </span>
            <span className="flex items-center lg:ms-4">
              <KeenIcon icon="down" className="!text-xs" />
            </span>
          </MenuToggle>

          <MenuSub className="menu-default w-[250px] py-2">
            {/* Search Input */}
            <div className="px-3 py-2 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            {/* Filtered Results */}
            <div className="max-h-60 overflow-y-auto">
              {filteredDropdownItems.length > 0 ? (
                filteredDropdownItems.map((item, index) => (
                  <MenuItem key={index} className={item.active ? 'active' : ''}>
                    <MenuLink path={item.path}>
                      <MenuTitle>{item.title}</MenuTitle>
                    </MenuLink>
                  </MenuItem>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No books found
                </div>
              )}
            </div>
          </MenuSub>
        </MenuItem>
      </Menu>

      {/* Chapters Section */}
      <div className="px-0 py-1">
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Chapters</h3>
      </div>
      {/* Chapters Dropdown */}
      <Menu highlight={true} className="menu-default w-full p-0">
        <MenuItem
          className="w-full"
          toggle="dropdown"
          trigger="hover"
          dropdownProps={{
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 0] // [skid, distance]
                }
              }
            ]
          }}
        >
          <MenuToggle className="w-full btn btn-light btn-sm justify-between flex-nowrap">
            <span className="flex items-center gap-1.5">
              Chapters
            </span>
            <span className="flex items-center lg:ms-4">
              <KeenIcon icon="down" className="!text-xs" />
            </span>
          </MenuToggle>

          <MenuSub className="menu-default w-[250px] py-2">
            {/* Search Input */}
            <div className="px-3 py-2 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search chapters..."
                value={chapterSearchTerm}
                onChange={(e) => setChapterSearchTerm(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            {/* Filtered Results */}
            <div className="max-h-60 overflow-y-auto">
              {filteredChapterItems.length > 0 ? (
                filteredChapterItems.map((item, index) => (
                  <MenuItem key={index} className={item.active ? 'active' : ''}>
                    <MenuLink path={item.path}>
                      <MenuTitle>{item.title}</MenuTitle>
                    </MenuLink>
                  </MenuItem>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No chapters found
                </div>
              )}
            </div>
          </MenuSub>
        </MenuItem>
      </Menu>

      {/* Verses Dropdown */}
      <div className="px-0 py-1">
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Verse</h3>
      </div>
      <Menu highlight={true} className="menu-default w-full p-0">
        <MenuItem
          className="w-full"
          toggle="dropdown"
          trigger="hover"
          dropdownProps={{
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 0] // [skid, distance]
                }
              }
            ]
          }}
        >
          <MenuToggle className="w-full btn btn-light btn-sm justify-between flex-nowrap">
            <span className="flex items-center gap-1.5">
              Verses
            </span>
            <span className="flex items-center lg:ms-4">
              <KeenIcon icon="down" className="!text-xs" />
            </span>
          </MenuToggle>

          <MenuSub className="menu-default w-[250px] py-2">
            {/* Search Input */}
            <div className="px-3 py-2 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search verses..."
                value={verseSearchTerm}
                onChange={(e) => setVerseSearchTerm(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            {/* Filtered Results */}
            <div className="max-h-60 overflow-y-auto">
              {filteredVerseItems.length > 0 ? (
                filteredVerseItems.map((item, index) => (
                  <MenuItem key={index} className={item.active ? 'active' : ''}>
                    <MenuLink path={item.path}>
                      <MenuTitle>{item.title}</MenuTitle>
                    </MenuLink>
                  </MenuItem>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No verses found
                </div>
              )}
            </div>
          </MenuSub>
        </MenuItem>
      </Menu>

      <div className='py-4'><hr></hr></div>

     
           {/* Toggle Buttons */}
      <div className="flex flex-col gap-2">
        {menuItems.map((heading, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="px-2 text-xs font-medium text-gray-600">{heading.title}</div>
            
            {heading.children.map((item, itemIndex) => (
              <button
                key={itemIndex}
                className={`flex items-center gap-2 py-2 px-2.5 rounded-md border border-transparent hover:bg-light hover:border-gray-200 transition-colors duration-200 ${
                  item.active ? 'bg-sand border-gray-200 font-medium text-primary' : 'text-gray-800'
                }`}
                onClick={() => {
                  // Handle toggle functionality here
                  // if (item.title === 'Deep Study') {
                  //   const newState = !deepStudyActive;
                  //   setDeepStudyActive(newState);
                  //   
                  //   // Dispatch custom event for deep study toggle
                  //   const event = new CustomEvent('deepStudyToggle', {
                  //     detail: {
                  //       action: 'toggleDeepStudy',
                  //       enabled: newState
                  //     }
                  //   });
                  //   window.dispatchEvent(event);
                  // } else 
                  if (item.title === 'Make Note') {
                    setShowMakeNote(true);
                  }
                  console.log(`Toggled: ${item.title}`);
                }}
              >
                <KeenIcon icon={item.icon} />
                <span className="text-2sm">{item.title}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Make Note Modal */}
      <MakeNote 
        isOpen={showMakeNote} 
        onClose={() => setShowMakeNote(false)} 
      />
    </div>
  );
};

export { SidebarMenuDashboard };
