// import { Container } from '@/components/container';
// import { KeenIcon, ProfileSetupModal } from '@/components';
// import { LucideVolume2, LucideBook, LightbulbIcon } from 'lucide-react';
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDashboard } from '@/pages/dashboards/providers/DashboardProvider';
// import { useBible } from '@/providers/BibleProvider';



// const HomePage = () => {
//   const [showProfileSetup, setShowProfileSetup] = useState(false);
//   const navigate = useNavigate();
//   const { selectBook, selectChapter, fetchSingleVerse, books } = useBible();


//   const { dashboardData, loading } = useDashboard();
//   if (loading) {
//     return <div className="text-center mt-10">Loading dashboard...</div>;
//   }


//   console.log('Dashboard Data:', dashboardData);

//   const getCurrentDate = () => {
//     const date = new Date();
//     return date.toLocaleDateString('en-US', {
//       weekday: 'short',
//       month: 'short',
//       day: '2-digit',
//       year: 'numeric'
//     });
//   };

//   const handleAudioPlay = () => {
//     console.log('Audio play clicked');
//   };

//   const handleReadMore = () => {
//     console.log('Read more clicked');
//   };

//   const handleResume = () => {
//     console.log('Resume reading clicked');
//   };


//   const handleStartReflection = async (reference: string) => {
//   if (!reference) return;
//   const match = reference.match(/([A-Za-z ]+)\s+(\d+):(\d+)/);
//   if (!match) return;

//   const [, bookName, chapter, verse] = match;
//   const bookSlug = bookName.trim().toLowerCase().replace(/\s+/g, "-");
//   const book = books?.find((b: any) => 
//     b.name.toLowerCase() === bookName.trim().toLowerCase()
//   );

//   if (book) {
//     await selectBook(book.book_id, book.name);
//     await selectChapter(Number(chapter));
//     await fetchSingleVerse(book.book_id, Number(chapter), Number(verse), 'KJV');
//   }

//   navigate(`/bible?bible=${bookSlug}&chapter=${chapter}&verse=${verse}`);
// };




//   const handleReadBible = () => {
//     console.log('Read Bible clicked');
//     navigate('/bible');
//   };

//   const profileProgress = 75;

//   return (
//     <Container>
//       <div className=" mx-auto min-h-screen p-0">

//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//           <div className="flex-1">

//             <h1 className="font-merriweather text-xl sm:text-2xl text-primary">
//               {dashboardData?.greeting || 'Good Morning'}, {dashboardData?.user?.first_name || 'User'}
//             </h1>

//             <p className="text-gray-600 text-xs sm:text-sm">
//               {getCurrentDate()}
//             </p>
//           </div>
//           <div className="relative w-full sm:w-auto sm:min-w-[200px]">
//             <button
//               onClick={handleReadBible}
//               className="w-full bg-gray-200 text-primary py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-medium flex items-center justify-center gap-3 sm:gap-4 hover:bg-gray-300 transition-colors text-base sm:text-lg"
//             >
//               <KeenIcon icon="book" className="text-sand text-lg sm:text-xl" />
//               <span>Read Bible</span>
//             </button>
//           </div>
//         </div>

//         {/* Profile Setup Progress Section */}
//         <div className="mb-6">
//           <div
//             className="bg-white/60 hover:bg-white/80 dark:bg-gray-300 hover:cursor-pointer dark:hover:bg-gray-400 rounded-2xl shadow-sm py-2 px-6"
//             onClick={() => setShowProfileSetup(true)}
//           >
//             <div className="flex items-center justify-between">
//               <div className="flex-1">
//                 <h2 className="font-merriweather text-xl text-primary mb-2">
//                   Complete Profile Setup
//                 </h2>
//                 <p className="text-gray-600 dark:text-gray-700 text-sm">
//                   {profileProgress}% completed • {100 - profileProgress}% remaining
//                 </p>
//               </div>
//               <div className="flex-shrink-0 ml-4">
//                 <div className="relative w-20 h-20">
//                   {/* Circular Progress Background */}
//                   <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
//                     <circle
//                       cx="40"
//                       cy="40"
//                       r="32"
//                       stroke="currentColor"
//                       strokeWidth="6"
//                       fill="none"
//                       className="text-gray-200 dark:text-gray-300"
//                     />
//                     {/* Progress Circle */}
//                     <circle
//                       cx="40"
//                       cy="40"
//                       r="32"
//                       stroke="currentColor"
//                       strokeWidth="6"
//                       fill="none"
//                       strokeLinecap="round"
//                       className="text-sand transition-all duration-300"
//                       strokeDasharray={`${2 * Math.PI * 32}`}
//                       strokeDashoffset={`${2 * Math.PI * 32 * (1 - profileProgress / 100)}`}
//                     />
//                   </svg>
//                   {/* Progress Text */}
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <span className="text-lg font-semibold text-primary">
//                       {profileProgress}%
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">

//           <div className="mb-6 lg:col-span-2">
//             <div className="bg-white/40 dark:bg-gray-100 rounded-2xl shadow-sm p-4 sm:p-6">
//               <h2 className="font-merriweather text-lg sm:text-xl text-primary mb-3 sm:mb-4">
//                 Your Daily Word
//               </h2>
//               <div className="bg-white/40 dark:bg-gray-200 rounded-xl p-3 sm:p-4 relative">
//                 <div className="mb-3 sm:mb-4">

//                   <h3 className="font-merriweather text-base sm:text-lg text-primary leading-relaxed mb-2 sm:mb-3">
//                     "{dashboardData?.daily_word?.reference || 'The Lord is my shepherd; I shall not want...'}"
//                   </h3>
//                   <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
//                     {dashboardData?.daily_word?.context || 'He maketh me to lie down in green pastures...'}
//                   </p>


//                 </div>
//                 <div className="flex gap-2 sm:gap-3 justify-end">
//                   <button
//                     onClick={handleAudioPlay}
//                     className="w-8 h-8 sm:w-10 sm:h-10 bg-sand rounded-full flex items-center justify-center hover:bg-white transition-colors"
//                   >
//                     <LucideVolume2 className='text-white text-sm sm:text-base' />
//                   </button>
//                   <button
//                     onClick={handleReadMore}
//                     className="w-8 h-8 sm:w-10 sm:h-10 bg-sand rounded-full flex items-center justify-center hover:bg-white transition-colors"
//                   >
//                     <LucideBook className='text-white text-sm sm:text-base' />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>



//           <div className="mb-6 lg:col-span-1">
//             <div className="bg-white/40 dark:bg-gray-100 rounded-2xl shadow-sm p-4 sm:p-6">
//               <h2 className="font-merriweather text-lg sm:text-xl text-primary mb-2">
//                 Continue Reading
//               </h2>

//               {dashboardData?.continue_reading ? (
//                 <>
//                   <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
//                     {`${dashboardData.continue_reading.book} ${dashboardData.continue_reading.chapter}:${dashboardData.continue_reading.verse} (${dashboardData.continue_reading.version})`}
//                   </p>
//                   <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
//                     <div className="w-full sm:flex-1 bg-white/70 dark:bg-gray-200 rounded-full h-2">
//                       <div
//                         className="bg-sand h-2 rounded-full"
//                         style={{ width: `${dashboardData.continue_reading.progress || 0}%` }}
//                       ></div>
//                     </div>
//                     <button
//                       onClick={handleResume}
//                       className="w-full sm:w-auto bg-sand dark:bg-gray-200 dark:hover:bg-sand-300 text-primary dark:text-primary px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors border border-transparent dark:border-gray-400"
//                     >
//                       Resume
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
//                     You haven’t started reading yet.
//                   </p>
//                   <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
//                     <div className="w-full sm:flex-1 bg-white/70 dark:bg-gray-200 rounded-full h-2">
//                       <div className="bg-sand h-2 rounded-full" style={{ width: '0%' }}></div>
//                     </div>
//                     <button
//                       onClick={handleReadBible}
//                       className="w-full sm:w-auto bg-sand dark:bg-gray-200 dark:hover:bg-sand-300 text-primary dark:text-primary px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors border border-transparent dark:border-gray-400"
//                     >
//                       Start Reading
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>



//         </div>



//         {/* Suggested Reflections Section (Dynamic from API) */}
//         <div className="mb-6">
//           <div className="bg-white/40 dark:bg-gray-100 rounded-2xl shadow-sm p-4 sm:p-6">
//             <h2 className="font-merriweather text-xl text-primary mb-4">
//               Suggested Reflections
//             </h2>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
//               {dashboardData?.daily_word?.suggestions &&
//                 dashboardData.daily_word.suggestions.length > 0 ? (
//                 dashboardData.daily_word.suggestions.slice(0, 3).map((reflection: any, index: number) => (
//                   <div
//                     key={index}
//                     className="bg-gray-50 dark:bg-gray-200 rounded-xl p-3 sm:p-4 border border-transparent dark:border-gray-400 hover:shadow-md transition-shadow"
//                   >
//                     <div className="flex items-start justify-between mb-3">
//                       <div className="flex-1 min-w-0">
//                         <h3 className="font-semibold text-primary text-sm sm:text-base mb-1 truncate">
//                           {reflection.reference || `Reflection ${index + 1}`}
//                         </h3>
//                         <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
//                           {reflection.text || reflection.context || "No description available."}
//                         </p>
//                       </div>
//                       <div className="ml-2 sm:ml-3 flex-shrink-0">
//                         <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full flex items-center justify-center">
//                           <LightbulbIcon className="text-yellow-800 text-xs sm:text-sm" />
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex justify-end">
//                       <button
//                         onClick={() => handleStartReflection(reflection.reference)}
//                         className="bg-primary text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-primary/90 transition-colors"
//                       >
//                         Start
//                       </button>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-600 text-sm">No reflections available.</p>
//               )}
//             </div>
//           </div>
//         </div>



//         <ProfileSetupModal
//           isOpen={showProfileSetup}
//           onClose={() => setShowProfileSetup(false)}
//         />
//       </div>
//     </Container>
//   );
// };

// export { HomePage };

















import { Container } from '@/components/container';
import { KeenIcon, ProfileSetupModal } from '@/components';
import { LucideVolume2, LucideBook, LightbulbIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '@/pages/dashboards/providers/DashboardProvider';
import { useBible } from '@/providers/BibleProvider';
import { useAuthContext } from "@/auth";
import { useLanguage } from '@/providers/TranslationProvider';
import { FormattedMessage, useIntl } from 'react-intl';
import AudioPlay from "@/components/audio/audioplay";
import axios from 'axios';





const HomePage = () => {
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const navigate = useNavigate();
  const { selectBook, selectChapter, fetchSingleVerse, books } = useBible();
  const { profileProgress, currentUser } = useAuthContext();
  const { currentLanguage } = useLanguage();
  const { formatMessage } = useIntl();
  const [showAudioPopup, setShowAudioPopup] = useState(false);

  const { dashboardData, loading } = useDashboard();
  const [readingProgress, setReadingProgress] = useState(0);

  const Loader = () => {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="w-6 h-6 border-2 border-gray-400 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  };

  

  useEffect(() => {
    const calculateProgress = async () => {
      if (!dashboardData?.continue_reading || !books.length) return;

      const { book, chapter, version } = dashboardData.continue_reading;
      const bookName = book.trim();
      const bookSlug = bookName.toLowerCase().replace(/\s+/g, "-");

      // Find book_id for API call
      const bookObj = books.find((b: any) =>
        b.name.toLowerCase() === bookName.toLowerCase()
      );

      if (!bookObj) return;

      try {
        // Fetch all verses for the chapter
        // We use a direct axios call here to avoid affecting the global BibleContext state
        // which might be displaying a different chapter/book
        const response = await axios.get(
          `/api/bible/books/${bookObj.book_id}/chapters/${chapter}/verses/${version || 'KJV'}`
        );

        const verses = response.data?.data?.verses || [];
        if (verses.length === 0) {
          setReadingProgress(0);
          return;
        }

        // Calculate how many verses are marked as read in localStorage
        let readCount = 0;
        verses.forEach((v: any) => {
          const verseKey = `verse-read-${bookSlug}-${chapter}-${v.verse}`;
          if (localStorage.getItem(verseKey) === 'true') {
            readCount++;
          }
        });

        const percentage = Math.round((readCount / verses.length) * 100);
        setReadingProgress(percentage);

      } catch (error) {
        console.error("Error calculating reading progress:", error);
      }
    };

    calculateProgress();
  }, [dashboardData?.continue_reading, books]);
  if (loading) {
    // return <div className="text-center mt-10"><FormattedMessage id="HOME.LOADING_DASHBOARD" /></div>;
    return (
      <div className="mt-10">
        <Loader />
      </div>
    );
  }


  console.log('Dashboard Data:', dashboardData);

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString(currentLanguage.code === 'nl' ? 'nl-NL' : 'en-US', {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  


  const handleAudioPlay = () => {
    console.log('Audio play clicked');
    setShowAudioPopup(true);
  };

  const handleReadMore = () => {
    console.log('Read more clicked');
  };

  const handleResume = () => {
    console.log('Resume reading clicked');
  };


  const handleStartReflection = (reference: string) => {
    if (!reference) return;
    const match = reference.match(/([A-Za-z ]+)\s+(\d+):(\d+)/);
    if (!match) return;

    const [, bookName, chapter, verse] = match;
    const bookSlug = bookName.trim().toLowerCase().replace(/\s+/g, "-");

    navigate(`/bible?bible=${bookSlug}&chapter=${chapter}&verse=${verse}`);

    const book = books?.find((b: any) =>
      b.name.toLowerCase() === bookName.trim().toLowerCase()
    );
    if (book) {
      selectBook(book.book_id, book.name);
      selectChapter(Number(chapter));
      fetchSingleVerse(book.book_id, Number(chapter), Number(verse), 'KJV');
    }
  };

  const handleReadBible = () => {
    console.log('Read Bible clicked');
    navigate('/bible');
  };

  const handleContinueReadingClick = () => {
    const data = dashboardData?.continue_reading;
    if (!data) return;

    const { book, chapter, verse, version } = data;

    const bookName = book.trim();
    const bookSlug = bookName.toLowerCase().replace(/\s+/g, "-");

    navigate(`/bible?bible=${bookSlug}&chapter=${chapter}&verse=${verse}`);

    const bookObj = books?.find((b: any) =>
      b.name.toLowerCase() === bookName.toLowerCase()
    );
    if (bookObj) {
      selectBook(bookObj.book_id, bookObj.name);
      selectChapter(Number(chapter));
      fetchSingleVerse(bookObj.book_id, Number(chapter), Number(verse), version || "KJV");
    }
  };

  const getGreeting = () => {
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 5 && hour < 12) return formatMessage({ id: 'GREETING.MORNING' });
    if (hour >= 12 && hour < 17) return formatMessage({ id: 'GREETING.AFTERNOON' });
    return formatMessage({ id: 'GREETING.EVENING' });
  };

  const handleReadDailyWord = () => {
    const reference = dashboardData?.daily_word?.reference;
    if (!reference) return;

    const match = reference.match(/([A-Za-z ]+)\s+(\d+):(\d+)/);
    if (!match) return;

    const [, bookName, chapter, verse] = match;
    const bookSlug = bookName.trim().toLowerCase().replace(/\s+/g, "-");

    // Navigate immediately - let BiblePage handle data fetching
    navigate(`/bible?bible=${bookSlug}&chapter=${chapter}&verse=${verse}`);

    // Fetch data in background (non-blocking)
    const book = books?.find((b: any) =>
      b.name.toLowerCase() === bookName.trim().toLowerCase()
    );
    if (book) {
      selectBook(book.book_id, book.name);
      selectChapter(Number(chapter));
      fetchSingleVerse(book.book_id, Number(chapter), Number(verse), 'KJV');
    }
  };

  // const truncateName = (name = "", maxLength = 11) => {
  //   return name.length > maxLength ? name.slice(0, maxLength) + "..." : name;
  // };


  // const profileProgress = 75;
  // const progress = profileProgress;
  const progress = profileProgress;


  return (
    <Container>
      <div className=" mx-auto min-h-screen p-0">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex-1">

            <h1 className="font-merriweather text-xl sm:text-2xl text-primary whitespace-nowrap">
              {/* {dashboardData?.greeting || getGreeting()}, {currentUser?.first_name ?? dashboardData?.user?.first_name ?? 'User'} */}
              {dashboardData?.greeting || getGreeting()},{" "}
              {`${(currentUser?.first_name || dashboardData?.user?.first_name || '')} ${(currentUser?.last_name || dashboardData?.user?.last_name || '')}`}
            </h1>

            <p className="text-gray-600 text-xs sm:text-sm">
              {getCurrentDate()}
            </p>
          </div>
          <div className="relative w-full sm:w-auto sm:min-w-[200px]">
            <button
              onClick={handleReadBible}
              className="w-full bg-gray-200 text-primary py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-medium flex items-center justify-center gap-3 sm:gap-4 hover:bg-gray-300 transition-colors text-base sm:text-lg"
            >
              <KeenIcon icon="book" className="text-sand text-lg sm:text-xl" />
              <span><FormattedMessage id="HOME.READ_BIBLE" /></span>
            </button>
          </div>
        </div>

        {/* Profile Setup Progress Section */}
        <div className="mb-6">
          <div
            className="bg-white/60 hover:bg-white/80 dark:bg-gray-300 hover:cursor-pointer dark:hover:bg-gray-400 rounded-2xl shadow-sm py-2 px-6"
            onClick={() => setShowProfileSetup(true)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="font-merriweather text-xl text-primary mb-2">
                  <FormattedMessage id="HOME.COMPLETE_PROFILE_SETUP" />
                </h2>
                <p className="text-gray-600 dark:text-gray-700 text-sm">
                  <FormattedMessage
                    id="HOME.PROFILE_PROGRESS"
                    values={{ progress: profileProgress, remaining: 100 - profileProgress }}
                  />
                </p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="relative w-20 h-20">
                  {/* Circular Progress Background */}
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-gray-200 dark:text-gray-300"
                    />
                    {/* Progress Circle */}
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      className="text-sand transition-all duration-300"
                      strokeDasharray={`${2 * Math.PI * 32}`}
                      strokeDashoffset={`${2 * Math.PI * 32 * (1 - profileProgress / 100)}`}
                    />
                  </svg>
                  {/* Progress Text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      {/* {profileProgress}% */}
                      {progress}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">

          <div className="mb-6 lg:col-span-2">
            <div className="bg-white/40 dark:bg-gray-100 rounded-2xl shadow-sm p-4 sm:p-6">
              <h2 className="font-merriweather text-lg sm:text-xl text-primary mb-3 sm:mb-4">
                <FormattedMessage id="HOME.YOUR_DAILY_WORD" />
              </h2>
              <div className="bg-white/40 dark:bg-gray-200 rounded-xl p-3 sm:p-4 relative">
                <div className="mb-3 sm:mb-4">

                  <h3 className="font-merriweather text-base sm:text-lg text-primary leading-relaxed mb-2 sm:mb-3">
                    "{dashboardData?.daily_word?.reference || 'The Lord is my shepherd; I shall not want...'}"
                  </h3>
                  <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                    {dashboardData?.daily_word?.context || 'He maketh me to lie down in green pastures...'}
                  </p>


                </div>
                <div className="flex gap-2 sm:gap-3 justify-end">
                  <button
                    onClick={handleAudioPlay}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-sand rounded-full flex items-center justify-center hover:bg-white hover:text-sand transition-colors"
                  >
                    <LucideVolume2 className='text-white hover:text-sand text-sm sm:text-base transition-colors' />
                  </button>
                  <button
                    onClick={handleReadDailyWord}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-sand rounded-full flex items-center justify-center hover:bg-white hover:text-sand transition-colors"
                  >
                    <LucideBook className='text-white hover:text-sand text-sm sm:text-base transition-colors' />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-6 lg:col-span-1">
            <div onClick={dashboardData?.continue_reading ? handleContinueReadingClick : undefined}
              className="bg-white/40 dark:bg-gray-100 rounded-2xl shadow-sm p-4 sm:p-6 cursor-pointer">
              <h2 className="font-merriweather text-lg sm:text-xl text-primary mb-2">
                <FormattedMessage id="HOME.CONTINUE_READING" />
              </h2>

              {dashboardData?.continue_reading ? (
                <>
                  <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
                    {`${dashboardData.continue_reading.book} ${dashboardData.continue_reading.chapter}:${dashboardData.continue_reading.verse} (${dashboardData.continue_reading.version})`}
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <div className="w-full sm:flex-1 bg-white/70 dark:bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-sand h-2 rounded-full"
                        style={{ width: `${readingProgress}%` }}
                      ></div>
                    </div>
                    <button
                      onClick={handleResume}
                      className="w-full sm:w-auto bg-sand dark:bg-gray-200 dark:hover:bg-sand-300 text-primary dark:text-primary px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors border border-transparent dark:border-gray-400"
                    >
                      <FormattedMessage id="HOME.RESUME" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
                    <FormattedMessage id="HOME.NO_READING_YET" />
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <div className="w-full sm:flex-1 bg-white/70 dark:bg-gray-200 rounded-full h-2">
                      <div className="bg-sand h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <button
                      onClick={handleReadBible}
                      className="w-full sm:w-auto bg-sand dark:bg-gray-200 dark:hover:bg-sand-300 text-primary dark:text-primary px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors border border-transparent dark:border-gray-400"
                    >
                      <FormattedMessage id="HOME.START_READING" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Suggested Reflections Section (Dynamic from API) */}
        <div className="mb-6">
          <div className="bg-white/40 dark:bg-gray-100 rounded-2xl shadow-sm p-4 sm:p-6">
            <h2 className="font-merriweather text-xl text-primary mb-4">
              <FormattedMessage id="HOME.SUGGESTED_REFLECTIONS" />
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {dashboardData?.daily_word?.suggestions &&
                dashboardData.daily_word.suggestions.length > 0 ? (
                dashboardData.daily_word.suggestions.slice(0, 3).map((reflection: any, index: number) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-200 rounded-xl p-3 sm:p-4 border border-transparent dark:border-gray-400 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-primary text-sm sm:text-base mb-1 truncate">
                          {reflection.reference || `Reflection ${index + 1}`}
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
                          {reflection.text || reflection.context || "No description available."}
                        </p>
                      </div>
                      <div className="ml-2 sm:ml-3 flex-shrink-0">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                          <LightbulbIcon className="text-yellow-800 text-xs sm:text-sm" />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleStartReflection(reflection.reference)}
                        className="bg-primary text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        <FormattedMessage id="HOME.START" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-sm"><FormattedMessage id="HOME.NO_REFLECTIONS" /></p>
              )}
            </div>
          </div>
        </div>



        <ProfileSetupModal
          isOpen={showProfileSetup}
          onClose={() => setShowProfileSetup(false)}
        />

        <AudioPlay
          isOpen={showAudioPopup}
          onClose={() => setShowAudioPopup(false)}
          reference={dashboardData?.daily_word?.reference}
          text={dashboardData?.daily_word?.context}
          audioUrl="/audio/sample.mp3"   // later dynamic
        />

      </div>
    </Container>
  );
};

export { HomePage };

















