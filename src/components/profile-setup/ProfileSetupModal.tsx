// import { useState, useEffect } from 'react';
// import { KeenIcon } from '@/components';
// import { useAuthContext } from "@/auth";


// interface ProfileSetupModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// interface Step {
//   id: string;
//   title: string;
//   description: string;
//   component: React.ReactNode;
// }

// const ProfileSetupModal = ({ isOpen, onClose }: ProfileSetupModalProps) => {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [profileData, setProfileData] = useState({
//     firstName: '',
//     lastName: '',
//     experience: '',
//     brings: [] as string[],
//     engage: [] as string[],
//     explainStyle: '',
//     translations: [] as string[],
//     dailyPref: '',
//     depth: ''
//   });

//   const steps: Step[] = [
//     {
//       id: 'name',
//       title: 'Personal Information',
//       description: 'Tell us your name',
//       component: (
//         <div className="space-y-4">
//           <div className="text-center mb-6">
//             <h3 className="text-xl font-semibold text-primary mb-2">What's your name?</h3>
//             <p className="text-gray-600 dark:text-gray-400">Help us personalize your experience</p>
//           </div>

//           <div className="space-y-4">
//             <div>
//               <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 First Name
//               </label>
//               <input
//                 type="text"
//                 id="firstName"
//                 value={profileData.firstName}
//                 onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
//                 placeholder="Enter your first name"
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-400 rounded-xl bg-white/60 dark:bg-gray-200 text-primary placeholder-gray-500 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//               />
//             </div>

//             <div>
//               <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Last Name
//               </label>
//               <input
//                 type="text"
//                 id="lastName"
//                 value={profileData.lastName}
//                 onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
//                 placeholder="Enter your last name"
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-400 rounded-xl bg-white/60 dark:bg-gray-200 text-primary placeholder-gray-500 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//               />
//             </div>
//           </div>
//         </div>
//       )
//     },
//     {
//       id: 'experience',
//       title: 'Bible Experience',
//       description: 'Tell us about your experience with the Bible',
//       component: (
//         <div className="space-y-4">
//           <div className="text-center mb-6">
//             <h3 className="text-xl font-semibold text-primary mb-2">What is your experience with Bible?</h3>
//             <p className="text-gray-600 dark:text-gray-400">Help us personalize your experience</p>
//           </div>

//           <div className="space-y-3">
//             {['First Time', 'Occasional', 'Regular', 'Theological'].map((option) => (
//               <button
//                 key={option}
//                 onClick={() => setProfileData(prev => ({ ...prev, experience: option }))}
//                 className={`w-full text-left rounded-xl transition-colors p-4 ${
//                   profileData.experience === option 
//                     ? 'bg-sand dark:bg-gray-400 border-2 border-primary' 
//                     : 'bg-white/60 dark:bg-gray-200 border-2 border-transparent hover:border-gray-300'
//                 }`}
//               >
//                 <div className="flex items-center justify-between">
//                   <span className="text-primary font-medium">{option}</span>
//                   {profileData.experience === option && (
//                     <KeenIcon icon="check" className="text-primary w-5 h-5" />
//                   )}
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>
//       )
//     },
//     {
//       id: 'brings',
//       title: 'App Purpose',
//       description: 'What brings you to this app?',
//       component: (
//         <div className="space-y-4">
//           <div className="text-center mb-6">
//             <h3 className="text-xl font-semibold text-primary mb-2">What brings you to this app?</h3>
//             <p className="text-gray-600 dark:text-gray-400">Select all that apply</p>
//           </div>

//           <div className="space-y-3">
//             {[
//               'To better understand what I read',
//               'To learn about faith and God',
//               'For daily inspiration or peace',
//               'For study or lesson preparation',
//               'Just curious'
//             ].map((option) => (
//               <button
//                 key={option}
//                 onClick={() => {
//                   setProfileData(prev => ({
//                     ...prev,
//                     brings: prev.brings.includes(option)
//                       ? prev.brings.filter(item => item !== option)
//                       : [...prev.brings, option]
//                   }));
//                 }}
//                 className={`w-full text-left rounded-xl transition-colors p-4 ${
//                   profileData.brings.includes(option)
//                     ? 'bg-sand dark:bg-gray-400 border-2 border-primary'
//                     : 'bg-white/60 dark:bg-gray-200 border-2 border-transparent hover:border-gray-300'
//                 }`}
//               >
//                 <div className="flex items-center justify-between">
//                   <span className="text-primary font-medium">{option}</span>
//                   {profileData.brings.includes(option) && (
//                     <KeenIcon icon="check" className="text-primary w-5 h-5" />
//                   )}
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>
//       )
//     },
//     {
//       id: 'engage',
//       title: 'Engagement Style',
//       description: 'How do you prefer to engage with the Bible?',
//       component: (
//         <div className="space-y-4">
//           <div className="text-center mb-6">
//             <h3 className="text-xl font-semibold text-primary mb-2">How do you prefer to engage with the Bible?</h3>
//             <p className="text-gray-600 dark:text-gray-400">Select all that apply</p>
//           </div>

//           <div className="space-y-3">
//             {['Reading', 'Listening', 'Speaking', 'Step-by-step guidance'].map((option) => (
//               <button
//                 key={option}
//                 onClick={() => {
//                   setProfileData(prev => ({
//                     ...prev,
//                     engage: prev.engage.includes(option)
//                       ? prev.engage.filter(item => item !== option)
//                       : [...prev.engage, option]
//                   }));
//                 }}
//                 className={`w-full text-left rounded-xl transition-colors p-4 ${
//                   profileData.engage.includes(option)
//                     ? 'bg-sand dark:bg-gray-400 border-2 border-primary'
//                     : 'bg-white/60 dark:bg-gray-200 border-2 border-transparent hover:border-gray-300'
//                 }`}
//               >
//                 <div className="flex items-center justify-between">
//                   <span className="text-primary font-medium">{option}</span>
//                   {profileData.engage.includes(option) && (
//                     <KeenIcon icon="check" className="text-primary w-5 h-5" />
//                   )}
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>
//       )
//     },
//     {
//       id: 'explainStyle',
//       title: 'Explanation Style',
//       description: 'What explanation style do you prefer?',
//       component: (
//         <div className="space-y-4">
//           <div className="text-center mb-6">
//             <h3 className="text-xl font-semibold text-primary mb-2">What explanation style do you prefer?</h3>
//             <p className="text-gray-600 dark:text-gray-400">Choose your preferred learning approach</p>
//           </div>

//           <div className="space-y-3">
//             {[
//               'Clear and simple language',
//               'A bit deeper with context',
//               'Mixed depending on topic',
//               "I'll decide later"
//             ].map((option) => (
//               <button
//                 key={option}
//                 onClick={() => setProfileData(prev => ({ ...prev, explainStyle: option }))}
//                 className={`w-full text-left rounded-xl transition-colors p-4 ${
//                   profileData.explainStyle === option
//                     ? 'bg-sand dark:bg-gray-400 border-2 border-primary'
//                     : 'bg-white/60 dark:bg-gray-200 border-2 border-transparent hover:border-gray-300'
//                 }`}
//               >
//                 <div className="flex items-center justify-between">
//                   <span className="text-primary font-medium">{option}</span>
//                   {profileData.explainStyle === option && (
//                     <KeenIcon icon="check" className="text-primary w-5 h-5" />
//                   )}
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>
//       )
//     },
//     {
//       id: 'translations',
//       title: 'Bible Translations',
//       description: 'Which Bible translation do you prefer?',
//       component: (
//         <div className="space-y-4">
//           <div className="text-center mb-6">
//             <h3 className="text-xl font-semibold text-primary mb-2">Which Bible translation do you prefer?</h3>
//             <p className="text-gray-600 dark:text-gray-400">Select your preferred translations</p>
//           </div>

//           <div className="space-y-3 max-h-64 overflow-y-auto">
//             {[
//               'KJV - King James Version',
//               'NKJV - New King James Version',
//               'NIV - New International Version',
//               'NLT - New Living Translation',
//               'ESV - English Standard Version',
//               'CSB - Christian Standard Bible',
//               'NASB - New American Standard Bible'
//             ].map((option) => (
//               <button
//                 key={option}
//                 onClick={() => {
//                   setProfileData(prev => ({
//                     ...prev,
//                     translations: prev.translations.includes(option)
//                       ? prev.translations.filter(item => item !== option)
//                       : [...prev.translations, option]
//                   }));
//                 }}
//                 className={`w-full text-left rounded-xl transition-colors p-4 ${
//                   profileData.translations.includes(option)
//                     ? 'bg-sand dark:bg-gray-400 border-2 border-primary'
//                     : 'bg-white/60 dark:bg-gray-200 border-2 border-transparent hover:border-gray-300'
//                 }`}
//               >
//                 <div className="flex items-center justify-between">
//                   <span className="text-primary font-medium">{option}</span>
//                   {profileData.translations.includes(option) && (
//                     <KeenIcon icon="check" className="text-primary w-5 h-5" />
//                   )}
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>
//       )
//     },
//     {
//       id: 'dailyPref',
//       title: 'Daily Content',
//       description: 'Would you like to receive daily content?',
//       component: (
//         <div className="space-y-4">
//           <div className="text-center mb-6">
//             <h3 className="text-xl font-semibold text-primary mb-2">Would you like to receive a daily verse or reflection?</h3>
//             <p className="text-gray-600 dark:text-gray-400">Choose your preference</p>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             {[
//               { key: 'Daily', label: 'Yes, Daily', icon: 'sun' },
//               { key: 'Occasionally', label: 'Occasionally', icon: 'calendar' }
//             ].map(({ key, label, icon }) => (
//               <button
//                 key={key}
//                 onClick={() => setProfileData(prev => ({ ...prev, dailyPref: key }))}
//                 className={`rounded-xl border-2 transition-colors text-center py-8 ${
//                   profileData.dailyPref === key
//                     ? 'bg-sand dark:bg-gray-400 border-primary'
//                     : 'border-gray-200 dark:border-gray-300 bg-white/60 dark:bg-gray-200 hover:border-gray-300'
//                 }`}
//               >
//                                  <div className="flex flex-col items-center justify-center gap-3 h-full">
//                    <KeenIcon icon={icon} className="w-16 h-16 text-primary/80 text-6xl" />
//                    <span className="text-primary font-medium">{label}</span>
//                  </div>
//               </button>
//             ))}
//           </div>
//         </div>
//       )
//     },
//     {
//       id: 'depth',
//       title: 'Reflection Depth',
//       description: 'How deep should each reflection be?',
//       component: (
//         <div className="space-y-4">
//           <div className="text-center mb-6">
//             <h3 className="text-xl font-semibold text-primary mb-2">How deep should each reflection be?</h3>
//             <p className="text-gray-600 dark:text-gray-400">Choose your preferred depth</p>
//           </div>

//           <div className="space-y-3">
//             {[
//               'Short (1-2 min read)',
//               'Medium (3-4 min read)',
//               'Deep dive (5+ min read)'
//             ].map((option) => (
//               <button
//                 key={option}
//                 onClick={() => setProfileData(prev => ({ ...prev, depth: option }))}
//                 className={`w-full text-left rounded-xl transition-colors p-4 ${
//                   profileData.depth === option
//                     ? 'bg-sand dark:bg-gray-400 border-2 border-primary'
//                     : 'bg-white/60 dark:bg-gray-200 border-2 border-transparent hover:border-gray-300'
//                 }`}
//               >
//                 <div className="flex items-center justify-between">
//                   <span className="text-primary font-medium">{option}</span>
//                   {profileData.depth === option && (
//                     <KeenIcon icon="check" className="text-primary w-5 h-5" />
//                   )}
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>
//       )
//     }
//   ];

//   const handleNext = () => {
//     if (currentStep < steps.length - 1) {
//       setCurrentStep(currentStep + 1);
//     } else {
//       // Complete profile setup
//       console.log('Profile setup completed:', profileData);
//       onClose();
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 0) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const handleClose = () => {
//     setCurrentStep(0);
//     setProfileData({
//       firstName: '',
//       lastName: '',
//       experience: '',
//       brings: [] as string[],
//       engage: [] as string[],
//       explainStyle: '',
//       translations: [] as string[],
//       dailyPref: '',
//       depth: ''
//     });
//     onClose();
//   };

//   // Cleanup effect when modal closes
//   useEffect(() => {
//     if (!isOpen) {
//       // Reset state when modal is closed
//       setCurrentStep(0);
//       setProfileData({
//         firstName: '',
//         lastName: '',
//         experience: '',
//         brings: [] as string[],
//         engage: [] as string[],
//         explainStyle: '',
//         translations: [] as string[],
//         dailyPref: '',
//         depth: ''
//       });
//     }
//   }, [isOpen]);

//   // Ensure modal is completely removed from DOM when closed
//   if (!isOpen) return null;

//   const currentStepData = steps[currentStep];
//   const progress = ((currentStep + 1) / steps.length) * 100;

//   return (
//     <div className="fixed inset-0 bg-black/50 dark:bg-black/60 flex items-center justify-center z-30">
//       <div className="bg-white/90 dark:bg-[--tw-page-bg-dark] backdrop-blur-sm rounded-2xl shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 pb-4 ">
//           <div className="flex-1">
//             <h2 className="text-xl font-semibold text-primary">{currentStepData.title}</h2>
//             <p className="text-gray-600 dark:text-gray-400 text-sm">{currentStepData.description}</p>
//           </div>
//           <button
//             onClick={handleClose}
//             className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
//           >
//             <KeenIcon icon="cross" className="text-xl" />
//           </button>
//         </div>

//         {/* Progress Bar */}
//         <div className="px-6 pb-4">
//           <div className="w-full bg-gray-200 dark:bg-gray-300 rounded-full h-2">
//             <div 
//               className="bg-sand h-2 rounded-full transition-all duration-300"
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>
//           <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
//             <span>Step {currentStep + 1} of {steps.length}</span>
//             <span>{Math.round(progress)}%</span>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="px-6 pb-6 flex-1 overflow-y-auto">
//           {currentStepData.component}
//         </div>

//         {/* Footer with Navigation */}
//         <div className="flex items-center justify-between p-6 pt-4 border-t border-gray-100 dark:border-gray-100">
//           <button
//             onClick={handleBack}
//             disabled={currentStep === 0}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
//               currentStep === 0
//                 ? 'bg-gray-100 dark:bg-gray-300 text-gray-400 dark:text-gray-500 cursor-not-allowed'
//                 : 'bg-gray-200 dark:bg-gray-300 text-gray-700 dark:text-gray-800 hover:bg-gray-300 dark:hover:bg-gray-400'
//             }`}
//           >
//             <KeenIcon icon="left" className="w-4 h-4" />
//             Back
//           </button>

//           <button
//             onClick={handleNext}
//             className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
//           >
//             {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
//             {currentStep < steps.length - 1 && <KeenIcon icon="right" className="w-4 h-4" />}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export { ProfileSetupModal };



























import { useState, useEffect } from 'react';
import { KeenIcon } from '@/components';
import { useAuthContext } from "@/auth";

interface ProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Step {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
}

const ProfileSetupModal = ({ isOpen, onClose }: ProfileSetupModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    experience: '',
    brings: [] as string[],
    engage: [] as string[],
    explainStyle: '',
    translations: [] as string[],
    dailyPref: '',
    depth: ''
  });

  // useAuthContext provides the necessary methods and currentUser
  const {
    currentUser,
    saveOrUpdateUserPreferences,
    getUser,
    setCurrentUser,
    setProfileProgress,
    refreshDashboard
  } = useAuthContext();

  const isUpdating = Boolean(currentUser?.is_preference_setup_done);



  const steps: Step[] = [
    {
      id: 'name',
      title: 'Personal Information',
      description: 'Tell us your name',
      component: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-primary mb-2">What's your name?</h3>
            <p className="text-gray-600 dark:text-gray-400">Help us personalize your experience</p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                maxLength={20}
                value={profileData.firstName}
                onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="Enter your first name"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-400 rounded-xl bg-white/60 dark:bg-gray-200 text-primary placeholder-gray-500 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                maxLength={20}
                value={profileData.lastName}
                onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Enter your last name"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-400 rounded-xl bg-white/60 dark:bg-gray-200 text-primary placeholder-gray-500 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'experience',
      title: 'Bible Experience',
      description: 'Tell us about your experience with the Bible',
      component: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-primary mb-2">What is your experience with Bible?</h3>
            <p className="text-gray-600 dark:text-gray-400">Help us personalize your experience</p>
          </div>

          <div className="space-y-3">
            {['First Time', 'Occasional', 'Regular', 'Theological'].map((option) => (
              <button
                key={option}
                onClick={() => setProfileData(prev => ({ ...prev, experience: option }))}
                className={`w-full text-left rounded-xl transition-colors p-4 ${profileData.experience === option
                  ? 'bg-sand dark:bg-gray-400 border-2 border-primary'
                  : 'bg-white/60 dark:bg-gray-200 border-2 border-transparent hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-primary font-medium">{option}</span>
                  {profileData.experience === option && (
                    <KeenIcon icon="check" className="text-primary w-5 h-5" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'brings',
      title: 'App Purpose',
      description: 'What brings you to this app?',
      component: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-primary mb-2">What brings you to this app?</h3>
            <p className="text-gray-600 dark:text-gray-400">Select all that apply</p>
          </div>

          <div className="space-y-3">
            {[
              'To better understand what I read',
              'To learn about faith and God',
              'For daily inspiration or peace',
              'For study or lesson preparation',
              'Just curious'
            ].map((option) => (
              <button
                key={option}
                onClick={() => {
                  setProfileData(prev => ({
                    ...prev,
                    brings: prev.brings.includes(option)
                      ? prev.brings.filter(item => item !== option)
                      : [...prev.brings, option]
                  }));
                }}
                className={`w-full text-left rounded-xl transition-colors p-4 ${profileData.brings.includes(option)
                  ? 'bg-sand dark:bg-gray-400 border-2 border-primary'
                  : 'bg-white/60 dark:bg-gray-200 border-2 border-transparent hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-primary font-medium">{option}</span>
                  {profileData.brings.includes(option) && (
                    <KeenIcon icon="check" className="text-primary w-5 h-5" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'engage',
      title: 'Engagement Style',
      description: 'How do you prefer to engage with the Bible?',
      component: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-primary mb-2">How do you prefer to engage with the Bible?</h3>
            <p className="text-gray-600 dark:text-gray-400">Select all that apply</p>
          </div>

          <div className="space-y-3">
            {['Reading', 'Listening', 'Speaking', 'Step-by-step guidance'].map((option) => (
              <button
                key={option}
                onClick={() => {
                  setProfileData(prev => ({
                    ...prev,
                    engage: prev.engage.includes(option)
                      ? prev.engage.filter(item => item !== option)
                      : [...prev.engage, option]
                  }));
                }}
                className={`w-full text-left rounded-xl transition-colors p-4 ${profileData.engage.includes(option)
                  ? 'bg-sand dark:bg-gray-400 border-2 border-primary'
                  : 'bg-white/60 dark:bg-gray-200 border-2 border-transparent hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-primary font-medium">{option}</span>
                  {profileData.engage.includes(option) && (
                    <KeenIcon icon="check" className="text-primary w-5 h-5" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'explainStyle',
      title: 'Explanation Style',
      description: 'What explanation style do you prefer?',
      component: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-primary mb-2">What explanation style do you prefer?</h3>
            <p className="text-gray-600 dark:text-gray-400">Choose your preferred learning approach</p>
          </div>

          <div className="space-y-3">
            {[
              'Clear and simple language',
              'A bit deeper with context',
              'Mixed depending on topic',
              "I'll decide later"
            ].map((option) => (
              <button
                key={option}
                onClick={() => setProfileData(prev => ({ ...prev, explainStyle: option }))}
                className={`w-full text-left rounded-xl transition-colors p-4 ${profileData.explainStyle === option
                  ? 'bg-sand dark:bg-gray-400 border-2 border-primary'
                  : 'bg-white/60 dark:bg-gray-200 border-2 border-transparent hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-primary font-medium">{option}</span>
                  {profileData.explainStyle === option && (
                    <KeenIcon icon="check" className="text-primary w-5 h-5" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'translations',
      title: 'Bible Translations',
      description: 'Which Bible translation do you prefer?',
      component: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-primary mb-2">Which Bible translation do you prefer?</h3>
            <p className="text-gray-600 dark:text-gray-400">Select your preferred translations</p>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {[
              'KJV - King James Version',
              'NKJV - New King James Version',
              'NIV - New International Version',
              'NLT - New Living Translation',
              'ESV - English Standard Version',
              'CSB - Christian Standard Bible',
              'NASB - New American Standard Bible'
            ].map((option) => (
              <button
                key={option}
                onClick={() => {
                  setProfileData(prev => ({
                    ...prev,
                    translations: prev.translations.includes(option)
                      ? prev.translations.filter(item => item !== option)
                      : [...prev.translations, option]
                  }));
                }}
                className={`w-full text-left rounded-xl transition-colors p-4 ${profileData.translations.includes(option)
                  ? 'bg-sand dark:bg-gray-400 border-2 border-primary'
                  : 'bg-white/60 dark:bg-gray-200 border-2 border-transparent hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-primary font-medium">{option}</span>
                  {profileData.translations.includes(option) && (
                    <KeenIcon icon="check" className="text-primary w-5 h-5" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'dailyPref',
      title: 'Daily Content',
      description: 'Would you like to receive daily content?',
      component: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-primary mb-2">Would you like to receive a daily verse or reflection?</h3>
            <p className="text-gray-600 dark:text-gray-400">Choose your preference</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'Daily', label: 'Yes, Daily', icon: 'sun' },
              { key: 'Occasionally', label: 'Occasionally', icon: 'calendar' }
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setProfileData(prev => ({ ...prev, dailyPref: key }))}
                className={`rounded-xl border-2 transition-colors text-center py-8 ${profileData.dailyPref === key
                  ? 'bg-sand dark:bg-gray-400 border-primary'
                  : 'border-gray-200 dark:border-gray-300 bg-white/60 dark:bg-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="flex flex-col items-center justify-center gap-3 h-full">
                  <KeenIcon icon={icon} className="w-16 h-16 text-primary/80 text-6xl" />
                  <span className="text-primary font-medium">{label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'depth',
      title: 'Reflection Depth',
      description: 'How deep should each reflection be?',
      component: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-primary mb-2">How deep should each reflection be?</h3>
            <p className="text-gray-600 dark:text-gray-400">Choose your preferred depth</p>
          </div>

          <div className="space-y-3">
            {[
              'Short (1-2 min read)',
              'Medium (3-4 min read)',
              'Deep dive (5+ min read)'
            ].map((option) => (
              <button
                key={option}
                onClick={() => setProfileData(prev => ({ ...prev, depth: option }))}
                className={`w-full text-left rounded-xl transition-colors p-4 ${profileData.depth === option
                  ? 'bg-sand dark:bg-gray-400 border-2 border-primary'
                  : 'bg-white/60 dark:bg-gray-200 border-2 border-transparent hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-primary font-medium">{option}</span>
                  {profileData.depth === option && (
                    <KeenIcon icon="check" className="text-primary w-5 h-5" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )
    }
  ];

  const hydrateFromUser = (u: any) => {
    if (!u) return;

    setProfileData(prev => ({
      ...prev,
      firstName: u.first_name || '',
      lastName: u.last_name || '',

      experience: u?.preferences?.experience_with_bible?.[0] || '',
      brings: u?.preferences?.what_brings_you ? (typeof u.preferences.what_brings_you === 'string' ? u.preferences.what_brings_you.split(',').map((s: string) => s.trim()) : u.preferences.what_brings_you) : [],
      engage: u?.preferences?.engagement_preference || [],
      explainStyle: u?.preferences?.explanation_style || '',
      translations: u?.preferences?.bible_version ? [u.preferences.bible_version] : [],
      dailyPref: u?.preferences?.receive_daily ? 'Daily' : 'Occasionally',
      depth: u?.preferences?.depth_level || '',
    }));
  };

  useEffect(() => {
    if (isOpen && currentUser) {
      hydrateFromUser(currentUser);
    }
  }, [isOpen, currentUser]);

  const calculateProgress = (data: any) => {
    let fields = [
      data.firstName,
      data.lastName,
      data.experience,
      data.brings?.length,
      data.engage?.length,
      data.explainStyle,
      data.translations?.length,
      data.dailyPref,
      data.depth,
    ];

    const filled = fields.filter(f => f && f !== "" && f !== 0).length;
    return Math.round((filled / fields.length) * 100);
  };

  // Update profile progress in real-time as user edits fields
  useEffect(() => {
    if (isOpen) {
      const progress = calculateProgress(profileData);
      setProfileProgress(progress);
    }
  }, [profileData, isOpen]);

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      // last step -> save
      const progress = calculateProgress(profileData);
      try {
        // set progress immediately in UI while request runs
        setProfileProgress(progress);
        const refreshedUser = await saveOrUpdateUserPreferences(profileData);
        let authoritativeUser = refreshedUser;
        if (!authoritativeUser) {
          authoritativeUser = await getUser();
        }
        if (setCurrentUser && authoritativeUser) {
          setCurrentUser(authoritativeUser);
        }
        await refreshDashboard();

        if (setProfileProgress && authoritativeUser) {
          // compute locally if you want to force it
          const localProgress = calculateProgress({
            firstName: authoritativeUser.first_name,
            lastName: authoritativeUser.last_name,
            experience: authoritativeUser?.preferences?.experience_with_bible?.[0] || '',
            brings: authoritativeUser?.preferences?.what_brings_you ? (typeof authoritativeUser.preferences.what_brings_you === 'string' ? authoritativeUser.preferences.what_brings_you.split(',').map((s: string) => s.trim()) : authoritativeUser.preferences.what_brings_you) : [],
            engage: authoritativeUser?.preferences?.engagement_preference || [],
            explainStyle: authoritativeUser?.preferences?.explanation_style || '',
            translations: authoritativeUser?.preferences?.bible_version ? [authoritativeUser.preferences.bible_version] : [],
            dailyPref: authoritativeUser?.preferences?.receive_daily ? 'Daily' : 'Occasionally',
            depth: authoritativeUser?.preferences?.depth_level || '',
          });
          setProfileProgress(localProgress);
        }
        hydrateFromUser(authoritativeUser);

        onClose();
      } catch (err) {
        console.error('Profile save failed', err);
      }

      return;
    }

    setCurrentStep(s => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    setProfileData({
      firstName: '',
      lastName: '',
      experience: '',
      brings: [] as string[],
      engage: [] as string[],
      explainStyle: '',
      translations: [] as string[],
      dailyPref: '',
      depth: ''
    });
    // Recalculate progress from saved user data when closing without saving
    if (currentUser && setProfileProgress) {
      const savedProgress = calculateProgress({
        firstName: currentUser.first_name || '',
        lastName: currentUser.last_name || '',
        experience: currentUser?.preferences?.experience_with_bible?.[0] || '',
        brings: currentUser?.preferences?.what_brings_you ? (typeof currentUser.preferences.what_brings_you === 'string' ? currentUser.preferences.what_brings_you.split(',').map((s: string) => s.trim()) : currentUser.preferences.what_brings_you) : [],
        engage: currentUser?.preferences?.engagement_preference || [],
        explainStyle: currentUser?.preferences?.explanation_style || '',
        translations: currentUser?.preferences?.bible_version ? [currentUser.preferences.bible_version] : [],
        dailyPref: currentUser?.preferences?.receive_daily ? 'Daily' : 'Occasionally',
        depth: currentUser?.preferences?.depth_level || '',
      });
      setProfileProgress(savedProgress);
    }
    onClose();
  };

  // If modal shouldn't render
  if (!isOpen) return null;

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/60 flex items-center justify-center z-30">
      <div className="bg-white/90 dark:bg-[--tw-page-bg-dark] backdrop-blur-sm rounded-2xl shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 ">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-primary">{currentStepData.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{currentStepData.description}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <KeenIcon icon="cross" className="text-xl" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pb-4">
          <div className="w-full bg-gray-200 dark:bg-gray-300 rounded-full h-2">
            <div
              className="bg-sand h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 flex-1 overflow-y-auto">
          {currentStepData.component}
        </div>

        {/* Footer with Navigation */}
        <div className="flex items-center justify-between p-6 pt-4 border-t border-gray-100 dark:border-gray-100">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${currentStep === 0
              ? 'bg-gray-100 dark:bg-gray-300 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-gray-200 dark:bg-gray-300 text-gray-700 dark:text-gray-800 hover:bg-gray-300 dark:hover:bg-gray-400'
              }`}
          >
            <KeenIcon icon="left" className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={handleNext}
            className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
            {currentStep < steps.length - 1 && <KeenIcon icon="right" className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export { ProfileSetupModal };





