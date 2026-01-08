import { Menu, MenuItem, MenuLink, MenuTitle, MenuToggle, KeenIcon, MenuSub, MenuIcon } from '@/components';
import { useLanguage } from '@/i18n';
import { useResponsive } from '@/hooks';
import { useState, useMemo, useEffect } from 'react';
import { MakeNote } from '@/components';
import { useBible } from '@/providers/BibleProvider';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SharePopUp from "@/components/share/SharePopUp";
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from "sonner";

const slugify = (text: string) => {
  return (text || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};


interface IDashboardDropdownItem {
  title: string;
  path: string;
  icon: string;
  active?: boolean;
}
interface IDashboardDropdownItems extends Array<IDashboardDropdownItem> { }

interface IMenuItem {
  title: string;
  path: string;
  icon: string;
  active?: boolean;
  action?: string;
}

interface IDashboardMenuItem {
  title: string;
  children: IMenuItem[];
}
interface IDashboardMenuItems extends Array<IDashboardMenuItem> { }

const SidebarMenuDashboard = () => {
  const { formatMessage } = useIntl();
  const {
    books, chapters, verses,
    loadingBooks, loadingChapters, loadingVerses, // Granular loading states
    error, setSelectedVerse, selectedBookName, selectedBookId, selectedChapter, selectBook, selectChapter, selectedVerse, fetchSingleVerse, version, toggleVerseBookmark, fetchDeepStudy, fetchDeepStudyForVerse, showDeepStudy, activeTab, verseActiveTab, deepStudyData
  } = useBible();
  const { isRTL } = useLanguage();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [chapterSearchTerm, setChapterSearchTerm] = useState('');
  const [verseSearchTerm, setVerseSearchTerm] = useState('');
  const [showMakeNote, setShowMakeNote] = useState(false);
  const navigate = useNavigate();
  const [showSharePopup, setShowSharePopup] = useState(false);
  const isVerseView = searchParams.get('bible') && searchParams.get('chapter') && searchParams.get('verse');

  const isChapterView = searchParams.get('bible') && searchParams.get('chapter') && !searchParams.get('verse');
  const isDesktop = useResponsive('up', 'lg');
  const trigger = isDesktop ? 'hover' : 'click';

  useEffect(() => {
    const bookSlug = searchParams.get('bible');
    const chapterParam = searchParams.get('chapter');
    const verseParam = searchParams.get('verse');

    if (!bookSlug) {
      if (selectedVerse) setSelectedVerse(null);
      return;
    }
    if (books.length === 0) return;

    const getBookIdFromSlug = (slug: string): string | null => {
      if (slug.length === 36) return slug;
      const found = books.find(
        (b) => slugify(b.name) === slugify(slug)
      );
      return found ? found.book_id : null;
    };

    const bookId = getBookIdFromSlug(bookSlug);
    if (!bookId) return;

    const chapterNum = chapterParam ? Number(chapterParam) : 1;
    const verseNum = verseParam ? Number(verseParam) : null;

    // Sync book ONLY if truly different or initialization is needed
    // This avoids double-triggering when selectBook was already called by a click handler
    if (bookId !== selectedBookId || chapterNum !== selectedChapter) {
      if (bookId !== selectedBookId) {
        const foundBook = books.find((b) => b.book_id === bookId);
        if (foundBook) {
          selectBook(bookId, foundBook.name, chapterNum).then(() => {
            if (verseNum && !isNaN(verseNum)) {
              fetchSingleVerse(bookId, chapterNum, verseNum, version || 'KJV');
            }
          });
        }
      } else {
        // Only chapter is different
        selectChapter(chapterNum).then(() => {
          if (verseNum && !isNaN(verseNum)) {
            fetchSingleVerse(bookId, chapterNum, verseNum, version || 'KJV');
          } else {
            setSelectedVerse(null);
          }
        });
      }
    } else if (verseNum && !isNaN(verseNum) && (!selectedVerse || selectedVerse.verse !== verseNum)) {
      // Book and chapter are same, but verse is different
      fetchSingleVerse(bookId, chapterNum, verseNum, version || 'KJV');
    } else if (!verseParam && selectedVerse) {
      // URL has no verse but we have one selected - clear it
      setSelectedVerse(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, books.length, version, formatMessage]);
  // Reduced dependencies to minimize unnecessary runs


  const filteredDropdownItems = useMemo(() => {
    if (!Array.isArray(books)) return [];
    const filtered = books.filter(
      (book: any) =>
        book?.name &&
        book.name.toLowerCase().includes(searchTerm.toLowerCase())

    );
    return filtered.map((book: any) => ({
      id: book.book_id,
      title: book.name,
      path: `/bible-content/${book.name?.toLowerCase().replace(/\s+/g, '-')}`,
      icon: 'book',
      active: false,
    }));
  }, [books, searchTerm]);



  // Filter chapters based on search term - similar to books search
  const filteredChapters = useMemo(() => {
    if (!Array.isArray(chapters)) return [];
    if (!chapterSearchTerm) return chapters;
    const searchLower = chapterSearchTerm.toLowerCase();
    return chapters.filter((chapter: any) =>
      chapter?.chapter?.toString().includes(searchLower) ||
      `${formatMessage({ id: 'BIBLE.CHAPTER_LABEL' })} ${chapter?.chapter}`.toLowerCase().includes(searchLower)
    );
  }, [chapters, chapterSearchTerm, formatMessage]);

  // Filter verses based on search term - similar to books search
  const filteredVerses = useMemo(() => {
    if (!Array.isArray(verses)) return [];
    if (!verseSearchTerm) return verses;
    const searchLower = verseSearchTerm.toLowerCase();
    return verses.filter((v: any) =>
      v?.verse?.toString().includes(searchLower) ||
      `${formatMessage({ id: 'BIBLE.VERSE_LABEL' })} ${v?.verse}`.toLowerCase().includes(searchLower) ||
      (v?.text && v.text.toLowerCase().includes(searchLower))
    );
  }, [verses, verseSearchTerm, formatMessage]);

  // Function to determine what text to share based on selection and deep study state
  const getShareText = (): string => {
    // Helper function to get bookId from book name/slug
    const getBookIdFromSlug = (bookSlug: string): string | null => {
      if (bookSlug.length === 36) return bookSlug; // Already a UUID
      if (bookSlug && books.length > 0) {
        // Find existing book ID from slug
        // const found = books.find(
        //   (b) => (b.name || '').toLowerCase().replace(/\s+/g, '-') === urlBookSlug.toLowerCase()
        // );
        const found = books.find(
          (b) => slugify(b.name) === slugify(bookSlug)
        );

        if (found) {
          return found.book_id;
        }
      }
      return null;
    };

    // Priority 1: If viewing verse-level deep study (VerseStudy component)
    if (isVerseView) {
      const bookSlug = searchParams.get('bible') || '';
      const chapter = searchParams.get('chapter') || '';
      const verse = searchParams.get('verse') || '';
      const bookId = getBookIdFromSlug(bookSlug);

      if (bookId && chapter && verse) {
        const verseKey = `${bookId}-${chapter}-${verse}-${version || 'KJV'}`;
        const tabData = deepStudyData?.[verseKey]?.[verseActiveTab];
        if (tabData?.content) {
          const content = tabData.content.replace(/\*/g, '').trim();
          if (content) {
            return content;
          }
        }
      }
      // If verse-level deep study content not available, fall through to verse text
    }

    // Priority 2: If chapter-level deep study is active, share deep study tab content
    // This applies when viewing all verses of a chapter (not a specific verse) and Deep Study is open
    if (showDeepStudy && isChapterView && !isVerseView && selectedBookId && selectedChapter) {
      const currentKey = `${selectedBookId}-${selectedChapter}-${version || 'KJV'}`;
      const tabData = deepStudyData?.[currentKey]?.[activeTab];
      if (tabData?.content) {
        const content = tabData.content.replace(/\*/g, '').trim();
        if (content) {
          return content;
        }
      }
      // If deep study is active but content is not available, fall through to verse/chapter sharing
    }

    // Priority 3: If a specific verse is selected (from URL or context), share only that verse
    if (isVerseView) {
      // We're in verse view but deep study content wasn't available, so share the verse text
      const bookSlug = searchParams.get('bible') || '';
      const chapter = searchParams.get('chapter') || '';
      const verse = searchParams.get('verse') || '';

      if (selectedVerse && selectedBookName) {
        return `${selectedBookName} ${selectedVerse.chapter}:${selectedVerse.verse}\n${selectedVerse.text}`;
      }

      // Try to get verse from verses array
      if (selectedBookName && chapter && verse && Array.isArray(verses) && verses.length > 0) {
        const verseNum = Number(verse);
        const chapterNum = Number(chapter);
        const foundVerse = verses.find((v: any) => v.verse === verseNum && v.chapter === chapterNum);
        if (foundVerse) {
          return `${selectedBookName} ${foundVerse.chapter}:${foundVerse.verse}\n${foundVerse.text}`;
        }
      }
    } else if (selectedVerse && selectedBookName) {
      return `${selectedBookName} ${selectedVerse.chapter}:${selectedVerse.verse}\n${selectedVerse.text}`;
    }

    // Priority 4: If book + chapter are selected (no verse), share all verses of the chapter
    // BUT ONLY if Deep Study is NOT active (to prevent sharing verses when Deep Study should be shared)
    if (selectedBookName && selectedChapter && Array.isArray(verses) && verses.length > 0 && !isVerseView) {
      // Check if Deep Study is active - if it is, don't share verses (Priority 2 should have handled it)
      if (!showDeepStudy) {
        // The verses array should already be filtered to the selected chapter, but filter to be safe
        const chapterVerses = verses.filter((v: any) => v.chapter === selectedChapter);

        if (chapterVerses.length > 0) {
          // Sort by verse number to ensure correct order
          const sortedVerses = chapterVerses.sort((a: any, b: any) => a.verse - b.verse);
          return sortedVerses
            .map((v: any) => `${v.verse}. ${v.text}`)
            .join('\n');
        }
      }
    }

    // Priority 5: If only book is selected (defaults to chapter 1), share chapter 1 verses
    if (selectedBookName && selectedBookId && selectedChapter === 1 && Array.isArray(verses) && verses.length > 0) {
      const chapter1Verses = verses.filter((v: any) => v.chapter === 1);
      if (chapter1Verses.length > 0) {
        // Sort by verse number to ensure correct order
        const sortedVerses = chapter1Verses.sort((a: any, b: any) => a.verse - b.verse);
        return sortedVerses
          .map((v: any) => `${v.verse}. ${v.text}`)
          .join('\n');
      }
    }

    // Fallback: No content available
    return "No content available to share.";
  };

  const menuItems: IDashboardMenuItems = [
    {
      title: formatMessage({ id: 'BIBLE.OPTIONS' }),
      children: [
        {
          title: formatMessage({ id: 'BIBLE.BOOKMARK' }),
          icon: 'bookmark',
          path: '',
          active: false,
          action: 'bookmark'
        },
        {
          title: formatMessage({ id: 'BIBLE.MAKE_NOTE' }),
          icon: 'pencil',
          path: '',
          active: false,
          action: 'makeNote'
        },
        {
          title: formatMessage({ id: 'BIBLE.SHARE' }),
          icon: 'share',
          path: '',
          active: false,
          action: 'share'
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

  // const handleBookClick = async (bookId: string, bookTitle: string) => {
  //   console.log("User clicked Book:", bookTitle, "=> ID:", bookId);
  //   await selectBook(bookId, bookTitle);
  // };


  // Handle Book Click
  const handleBookClick = async (bookId: string, bookTitle: string) => {
    // const bookSlug = bookTitle.toLowerCase().replace(/\s+/g, '-');
    const bookSlug = slugify(bookTitle);
    navigate(`/bible?bible=${bookSlug}&chapter=1`);
    await selectBook(bookId, bookTitle, 1);
  };




  // const handleChapterClick = (chapterNumber: number, bookId: string) => {
  //   console.log("Fetching verses for chapter:", chapterNumber);
  //   selectChapter(chapterNumber);
  // };

  const handleChapterClick = async (chapterNumber: number, bookId: string) => {
    console.log("Fetching verses for chapter:", chapterNumber);
    // Case 2: Book + Chapter selected - reset verse to All (edge case)
    await selectChapter(chapterNumber);

    // Update URL to remove verse parameter (reset to "All")
    const bookSlug = selectedBookName?.toLowerCase().replace(/\s+/g, '-') || '';
    if (bookSlug) {
      navigate(`/bible?bible=${bookSlug}&chapter=${chapterNumber}`);
    }
  };





  return (
    <div className="flex flex-col gap-1 ps-1 pe-4 lg:px-2.5">
      {/* Bible Books Section */}
      <div className="px-0 py-1">
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          <FormattedMessage id="BIBLE.BIBLE_BOOKS" />
        </h3>
      </div>

      {loadingBooks ? (
        // <div className="px-3 py-2 text-sm text-gray-500">Loading books...</div>
        <div className="px-3 py-2 flex justify-center">
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="px-3 py-2 text-sm text-red-500">{error}</div>
      ) : (
        <Menu highlight={true} className="menu-default w-full p-0">
          <MenuItem
            className="w-full"
            toggle="dropdown"

            // trigger="hover"
            trigger={trigger}
            dropdownProps={{
              disablePortal: !isDesktop,
              placement: isRTL() ? 'bottom-start' : 'bottom-end',
              modifiers: [{ name: 'offset', options: { offset: [0, 0] } }],
            }}
          >
            <MenuToggle className="w-full btn btn-light btn-sm justify-between flex-nowrap">
              <span className="flex items-center gap-1.5">{selectedBookName || 'Genesis'}</span>
              <span className="flex items-center lg:ms-4">
                <KeenIcon icon="down" className="!text-xs" />
              </span>
            </MenuToggle>

            <MenuSub className="menu-default w-[180px] py-2">
              {/* Search Input */}
              <div className="px-3 py-2 border-b border-gray-200" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  placeholder={formatMessage({ id: 'BIBLE.SEARCH_BOOKS' })}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>


              {/* <div
                onClick={() => console.log("Outer div clicked")}
                className="max-h-60 overflow-y-auto"
              > */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Outer div clicked");
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className="max-h-60 overflow-y-auto"
                style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain', touchAction: 'pan-y' }}
              >
                {filteredDropdownItems.length > 0 ? (
                  filteredDropdownItems.map((item, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(" Book clicked:", item.id);
                        handleBookClick(item.id, item.title);
                      }}
                    >
                      {item.title}
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">{formatMessage({ id: 'BIBLE.NO_BOOKS_FOUND' })}</div>
                )}
              </div>
            </MenuSub>
          </MenuItem>
        </Menu>
      )}

      <div className="px-0 py-1">
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          <FormattedMessage id="BIBLE.CHAPTERS" />
        </h3>
      </div>
      {/* Chapters Dropdown */}
      <Menu highlight={true} className="menu-default w-full p-0">
        <MenuItem className="w-full" toggle="dropdown"
          // trigger="hover"
          trigger={trigger}
          dropdownProps={{
            disablePortal: !isDesktop,
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
              {/* Chapters */}
              {selectedChapter ? `${formatMessage({ id: 'BIBLE.CHAPTER_LABEL' })} ${selectedChapter}` : formatMessage({ id: 'BIBLE.CHAPTERS_LABEL' })}
            </span>
            <span className="flex items-center lg:ms-4">
              <KeenIcon icon="down" className="!text-xs" />
            </span>
          </MenuToggle>

          <MenuSub className="menu-default w-[180px] py-2">
            {/* Search Input */}
            <div className="px-3 py-2 border-b border-gray-200" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                placeholder={formatMessage({ id: 'BIBLE.SEARCH_CHAPTERS' })}
                value={chapterSearchTerm}
                onChange={(e) => setChapterSearchTerm(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Filtered Results */}
            {/* <div className="max-h-60 overflow-y-auto"> */}
            {/* <div className="max-h-60 overflow-y-auto"> */}
            {/* <div className="max-h-60 overflow-y-auto"> */}
            <div
              className="max-h-60 overflow-y-auto"
              style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain', touchAction: 'pan-y' }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              {loadingChapters ? (
                <div className="px-3 py-2 text-sm text-gray-500">{formatMessage({ id: 'BIBLE.LOADING_CHAPTERS' })}</div>
              ) : filteredChapters.length > 0 ? (
                filteredChapters.map((c, index) => (
                  <div
                    key={index}
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${selectedChapter === c.chapter ? 'bg-gray-200 font-semibold' : ''
                      }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChapterClick(c.chapter, c.book_id);
                    }}
                  >
                    {formatMessage({ id: 'BIBLE.CHAPTER_LABEL' })} {c.chapter}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">{formatMessage({ id: 'BIBLE.NO_CHAPTERS_FOUND' })}</div>
              )}
            </div>

          </MenuSub>
        </MenuItem>
      </Menu>

      {/* Verse Dropdown */}
      <div className="px-0 py-1">
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          <FormattedMessage id="BIBLE.VERSES" />
        </h3>
      </div>

      <Menu highlight={true} className="menu-default w-full p-0">
        <MenuItem
          className="w-full"
          toggle="dropdown"
          // trigger="hover"
          trigger={trigger}
          dropdownProps={{
            disablePortal: !isDesktop,
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [{ name: 'offset', options: { offset: [0, 0] } }],
          }}
        >
          <MenuToggle className="w-full btn btn-light btn-sm justify-between flex-nowrap">
            {/* <span className="flex items-center gap-1.5">Verses</span> */}
            <span className="flex items-center gap-1.5">
              {selectedVerse ? `${formatMessage({ id: 'BIBLE.VERSE_LABEL' })} ${selectedVerse.verse}` : formatMessage({ id: 'BIBLE.VERSES_LABEL' })}
            </span>
            <span className="flex items-center lg:ms-4">
              <KeenIcon icon="down" className="!text-xs" />
            </span>
          </MenuToggle>

          <MenuSub className="menu-default w-[180px] py-2">
            {/* Search Input */}
            <div className="px-3 py-2 border-b border-gray-200" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                placeholder={formatMessage({ id: 'BIBLE.SEARCH_VERSES' })}
                value={verseSearchTerm}
                onChange={(e) => setVerseSearchTerm(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Filtered Verse List */}
            {/* <div className="max-h-60 overflow-y-auto"> */}
            {/* <div className="max-h-60 overflow-y-auto"> */}
            {/* <div className="max-h-60 overflow-y-auto"> */}
            <div
              className="max-h-60 overflow-y-auto"
              style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain', touchAction: 'pan-y' }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              {loadingVerses ? (
                <div className="px-3 py-2 text-sm text-gray-500">{formatMessage({ id: 'BIBLE.LOADING_VERSES' })}</div>
              ) : filteredVerses.length > 0 ? (
                filteredVerses.map((v, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    onClick={async (e) => {
                      e.stopPropagation();
                      console.log(" Selected Verse:", v);
                      if (selectedBookId) {
                        await fetchSingleVerse(selectedBookId, v.chapter, v.verse, version || 'KJV');
                      } else {
                        setSelectedVerse(v);
                      }

                      const bookSlug = (selectedBookName || v.book_name)?.toLowerCase().replace(/\s+/g, '-');
                      navigate(`/bible?bible=${bookSlug}&chapter=${v.chapter}&verse=${v.verse}`);
                    }}
                  >
                    {formatMessage({ id: 'BIBLE.VERSE_LABEL' })} {v.verse}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  {formatMessage({ id: 'BIBLE.NO_VERSES_FOUND' })}
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
                className={`flex items-center gap-2 py-2 px-2.5 rounded-md border border-transparent hover:bg-light hover:border-gray-200 transition-colors duration-200 ${item.active ? 'bg-sand border-gray-200 font-medium text-primary' : 'text-gray-800'
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

                  if (item.action === 'bookmark') {

                    if (!selectedBookName || !selectedVerse) {
                      console.warn("No verse selected for bookmark");
                      // toast.error("Please select a verse to bookmark");
                      toast.error(formatMessage({ id: 'TOAST.SELECT_VERSE_TO_BOOKMARK' }));
                      return;
                    }

                    toggleVerseBookmark(
                      selectedBookName,
                      selectedVerse.chapter,
                      selectedVerse.verse,
                      version || "KJV"
                    );
                  }

                  if (item.action === 'makeNote') {
                    setShowMakeNote(true);
                  }
                  console.log(`Toggled: ${item.title}`);

                  if (item.action === 'share') {
                    setShowSharePopup(true);
                  }
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

      <SharePopUp
        isOpen={showSharePopup}
        onClose={() => setShowSharePopup(false)}
        textToShare={getShareText()}
      />


    </div>
  );
};

export { SidebarMenuDashboard };
