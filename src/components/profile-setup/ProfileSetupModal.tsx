import { useState, useEffect } from 'react';
import { KeenIcon } from '@/components';
import { useAuthContext } from "@/auth";
import { toast } from "sonner";
import { FormattedMessage, useIntl } from 'react-intl';
import { useDashboard } from '@/pages/dashboards/providers/DashboardProvider';

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
  const { formatMessage } = useIntl();
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

  // Get dashboard refetcher for instant updates
  const { refetch: dashboardRefetch } = useDashboard();

  const isUpdating = Boolean(currentUser?.is_preference_setup_done);



  const steps: Step[] = [
    {
      id: 'name',
      title: formatMessage({ id: 'PROFILE_SETUP.PERSONAL_INFORMATION' }),
      description: formatMessage({ id: 'PROFILE_SETUP.WHATS_YOUR_NAME' }),
      component: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-primary mb-2">
              <FormattedMessage id="PROFILE_SETUP.WHATS_YOUR_NAME" />
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              <FormattedMessage id="PROFILE_SETUP.HELP_PERSONALIZE" />
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FormattedMessage id="PROFILE_SETUP.FIRST_NAME" />
              </label>
              <input
                type="text"
                id="firstName"
                maxLength={20}
                value={profileData.firstName}
                onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder={formatMessage({ id: 'PROFILE_SETUP.ENTER_FIRST_NAME' })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-400 rounded-xl bg-white/60 dark:bg-gray-200 text-primary placeholder-gray-500 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FormattedMessage id="PROFILE_SETUP.LAST_NAME" />
              </label>
              <input
                type="text"
                id="lastName"
                maxLength={20}
                value={profileData.lastName}
                onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder={formatMessage({ id: 'PROFILE_SETUP.ENTER_LAST_NAME' })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-400 rounded-xl bg-white/60 dark:bg-gray-200 text-primary placeholder-gray-500 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'experience',
      title: formatMessage({ id: 'PROFILE_SETUP.BIBLE_EXPERIENCE' }),
      description: formatMessage({ id: 'PROFILE_SETUP.HELP_PERSONALIZE' }),
      component: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-primary mb-2">
              <FormattedMessage id="PROFILE_SETUP.WHAT_EXPERIENCE" />
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              <FormattedMessage id="PROFILE_SETUP.HELP_PERSONALIZE" />
            </p>
          </div>

          <div className="space-y-3">
            {['First Time', 'Occasional', 'Regular', 'Theological'].map((option) => {
              const translatedOption = option === 'First Time' ? formatMessage({ id: 'PROFILE_SETUP.EXPERIENCE_FIRST_TIME' }) :
                option === 'Occasional' ? formatMessage({ id: 'PROFILE_SETUP.EXPERIENCE_OCCASIONAL' }) :
                  option === 'Regular' ? formatMessage({ id: 'PROFILE_SETUP.EXPERIENCE_REGULAR' }) :
                    formatMessage({ id: 'PROFILE_SETUP.EXPERIENCE_THEOLOGICAL' });

              return (
                <button
                  key={option}
                  onClick={() => setProfileData(prev => ({ ...prev, experience: option }))}
                  className={`w-full text-left rounded-xl transition-colors p-4 ${profileData.experience === option
                    ? 'bg-sand dark:bg-gray-400 border-2 border-primary'
                    : 'bg-white/60 dark:bg-gray-200 border-2 border-transparent hover:border-gray-300'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-medium">{translatedOption}</span>
                    {profileData.experience === option && (
                      <KeenIcon icon="check" className="text-primary w-5 h-5" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )
    },
    {
      id: 'brings',
      title: formatMessage({ id: 'PROFILE_SETUP.APP_PURPOSE' }),
      description: formatMessage({ id: 'PROFILE_SETUP.WHAT_BRINGS_YOU' }),
      component: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-primary mb-2">
              <FormattedMessage id="PROFILE_SETUP.WHAT_BRINGS_YOU" />
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              <FormattedMessage id="PROFILE_SETUP.SELECT_ALL_APPLY" />
            </p>
          </div>

          <div className="space-y-3">
            {[
              { key: 'To better understand what I read', id: 'PROFILE_SETUP.BRINGS_UNDERSTAND' },
              { key: 'To learn about faith and God', id: 'PROFILE_SETUP.BRINGS_LEARN' },
              { key: 'For daily inspiration or peace', id: 'PROFILE_SETUP.BRINGS_INSPIRATION' },
              { key: 'For study or lesson preparation', id: 'PROFILE_SETUP.BRINGS_STUDY' },
              { key: 'Just curious', id: 'PROFILE_SETUP.BRINGS_CURIOUS' }
            ].map(({ key, id }) => (
              <button
                key={key}
                onClick={() => {
                  setProfileData(prev => ({
                    ...prev,
                    brings: prev.brings.includes(key)
                      ? prev.brings.filter(item => item !== key)
                      : [...prev.brings, key]
                  }));
                }}
                className={`w-full text-left rounded-xl transition-colors p-4 ${profileData.brings.includes(key)
                  ? 'bg-sand dark:bg-gray-400 border-2 border-primary'
                  : 'bg-white/60 dark:bg-gray-200 border-2 border-transparent hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-primary font-medium">
                    <FormattedMessage id={id} />
                  </span>
                  {profileData.brings.includes(key) && (
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
      title: formatMessage({ id: 'PROFILE_SETUP.ENGAGEMENT_STYLE' }),
      description: formatMessage({ id: 'PROFILE_SETUP.HOW_ENGAGE' }),
      component: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-primary mb-2">
              <FormattedMessage id="PROFILE_SETUP.HOW_ENGAGE" />
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              <FormattedMessage id="PROFILE_SETUP.SELECT_ALL_APPLY" />
            </p>
          </div>

          <div className="space-y-3">
            {[
              { key: 'Reading', id: 'PROFILE_SETUP.ENGAGE_READING' },
              { key: 'Listening', id: 'PROFILE_SETUP.ENGAGE_LISTENING' },
              { key: 'Speaking', id: 'PROFILE_SETUP.ENGAGE_SPEAKING' },
              { key: 'Step-by-step guidance', id: 'PROFILE_SETUP.ENGAGE_GUIDANCE' }
            ].map(({ key, id }) => (
              <button
                key={key}
                onClick={() => {
                  setProfileData(prev => ({
                    ...prev,
                    engage: prev.engage.includes(key)
                      ? prev.engage.filter(item => item !== key)
                      : [...prev.engage, key]
                  }));
                }}
                className={`w-full text-left rounded-xl transition-colors p-4 ${profileData.engage.includes(key)
                  ? 'bg-sand dark:bg-gray-400 border-2 border-primary'
                  : 'bg-white/60 dark:bg-gray-200 border-2 border-transparent hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-primary font-medium">
                    <FormattedMessage id={id} />
                  </span>
                  {profileData.engage.includes(key) && (
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
      title: formatMessage({ id: 'PROFILE_SETUP.EXPLANATION_STYLE' }),
      description: formatMessage({ id: 'PROFILE_SETUP.WHAT_EXPLANATION_STYLE' }),
      component: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-primary mb-2">
              <FormattedMessage id="PROFILE_SETUP.WHAT_EXPLANATION_STYLE" />
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              <FormattedMessage id="PROFILE_SETUP.CHOOSE_LEARNING" />
            </p>
          </div>

          <div className="space-y-3">
            {[
              { key: 'Clear and simple language', id: 'PROFILE_SETUP.STYLE_SIMPLE' },
              { key: 'A bit deeper with context', id: 'PROFILE_SETUP.STYLE_DEEPER' },
              { key: 'Mixed depending on topic', id: 'PROFILE_SETUP.STYLE_MIXED' },
              { key: "I'll decide later", id: 'PROFILE_SETUP.STYLE_DECIDE_LATER' }
            ].map(({ key, id }) => (
              <button
                key={key}
                onClick={() => setProfileData(prev => ({ ...prev, explainStyle: key }))}
                className={`w-full text-left rounded-xl transition-colors p-4 ${profileData.explainStyle === key
                  ? 'bg-sand dark:bg-gray-400 border-2 border-primary'
                  : 'bg-white/60 dark:bg-gray-200 border-2 border-transparent hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-primary font-medium">
                    <FormattedMessage id={id} />
                  </span>
                  {profileData.explainStyle === key && (
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
      title: formatMessage({ id: 'PROFILE_SETUP.BIBLE_TRANSLATIONS' }),
      description: formatMessage({ id: 'PROFILE_SETUP.WHICH_TRANSLATION' }),
      component: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-primary mb-2">
              <FormattedMessage id="PROFILE_SETUP.WHICH_TRANSLATION" />
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              <FormattedMessage id="PROFILE_SETUP.SELECT_TRANSLATIONS" />
            </p>
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
      title: formatMessage({ id: 'PROFILE_SETUP.DAILY_CONTENT' }),
      description: formatMessage({ id: 'PROFILE_SETUP.RECEIVE_DAILY' }),
      component: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-primary mb-2">
              <FormattedMessage id="PROFILE_SETUP.RECEIVE_DAILY" />
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              <FormattedMessage id="PROFILE_SETUP.CHOOSE_PREFERENCE" />
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'Daily', id: 'PROFILE_SETUP.YES_DAILY', icon: 'sun' },
              { key: 'Occasionally', id: 'PROFILE_SETUP.OCCASIONALLY', icon: 'calendar' }
            ].map(({ key, id, icon }) => (
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
                  <span className="text-primary font-medium">
                    <FormattedMessage id={id} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'depth',
      title: formatMessage({ id: 'PROFILE_SETUP.REFLECTION_DEPTH' }),
      description: formatMessage({ id: 'PROFILE_SETUP.HOW_DEEP' }),
      component: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-primary mb-2">
              <FormattedMessage id="PROFILE_SETUP.HOW_DEEP" />
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              <FormattedMessage id="PROFILE_SETUP.CHOOSE_DEPTH" />
            </p>
          </div>

          <div className="space-y-3">
            {[
              { key: 'Short (1-2 min read)', id: 'PROFILE_SETUP.DEPTH_SHORT' },
              { key: 'Medium (3-4 min read)', id: 'PROFILE_SETUP.DEPTH_MEDIUM' },
              { key: 'Deep dive (5+ min read)', id: 'PROFILE_SETUP.DEPTH_DEEP' }
            ].map(({ key, id }) => (
              <button
                key={key}
                onClick={() => setProfileData(prev => ({ ...prev, depth: key }))}
                className={`w-full text-left rounded-xl transition-colors p-4 ${profileData.depth === key
                  ? 'bg-sand dark:bg-gray-400 border-2 border-primary'
                  : 'bg-white/60 dark:bg-gray-200 border-2 border-transparent hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-primary font-medium">
                    <FormattedMessage id={id} />
                  </span>
                  {profileData.depth === key && (
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

  // Helper function to map backend experience enum to UI format
  const experienceFromEnum = (val?: string): string => {
    const v = (val || '').toString();
    const up = v.toUpperCase();
    if (up === 'FIRST_TIME' || up === 'NEW_TO_BIBLE') return 'First Time';
    if (up === 'OCCASIONAL' || up === 'SOME_KNOWLEDGE') return 'Occasional';
    if (up === 'REGULAR' || up === 'REGULAR_STUDY') return 'Regular';
    if (up === 'THEOLOGICAL' || up === 'ADVANCED_THEOLOGY') return 'Theological';
    const norm = v.trim().toLowerCase();
    if (norm.includes('new') || norm.includes('first')) return 'First Time';
    if (norm.includes('some') || norm.includes('occasional')) return 'Occasional';
    if (norm.includes('regular')) return 'Regular';
    if (norm.includes('advanced') || norm.includes('theolog')) return 'Theological';
    return '';
  };

  // Helper function to map backend explanation_style to UI format
  const explanationStyleFromBackend = (val?: string): string => {
    const style = (val || '').toString().toLowerCase();
    if (style === 'simple') return 'Clear and simple language';
    if (style === 'balanced' || style === 'deeper' || style === 'deep') return 'A bit deeper with context';
    if (style === 'mixed') return 'Mixed depending on topic';
    // If style exists but doesn't match, return empty to force user to select
    return '';
  };

  // Helper function to map backend bible_version code to full UI format
  const titleForVersionCode = (code?: string): string => {
    const versionOptions = [
      'KJV - King James Version',
      'NKJV - New King James Version',
      'NIV - New International Version',
      'NLT - New Living Translation',
      'ESV - English Standard Version',
      'CSB - Christian Standard Bible',
      'NASB - New American Standard Bible'
    ];
    const c = (code || '').toUpperCase();
    const match = versionOptions.find((o) => o.startsWith(`${c} `));
    return match || '';
  };

  // Helper function to convert backend enum to title case for engagement
  const toTitleCase = (s: string) => s
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const hydrateFromUser = (u: any) => {
    if (!u) return;

    const backend = u.preferences || u.preference || u.user_preferences || u.settings?.preferences;
    
    // Always hydrate from the latest user object to ensure sync with PersonalizationCard
    // Default dailyPref to 'Daily' if not set, or use the saved value
    const savedDailyPref = u?.preferences?.receive_daily ? 'Daily' : (u?.preferences?.receive_daily === false ? 'Occasionally' : 'Daily');

    // Map depth_level from backend to UI format
    const depthLevel = (backend?.depth_level || '').toString().toLowerCase();
    const mappedDepth = depthLevel === 'short'
      ? 'Short (1-2 min read)'
      : depthLevel === 'medium'
        ? 'Medium (3-4 min read)'
        : depthLevel === 'deep'
          ? 'Deep dive (5+ min read)'
          : '';

    // Map experience_with_bible from backend enum to UI format
    const exp = Array.isArray(backend?.experience_with_bible)
      ? backend.experience_with_bible[0]
      : backend?.experience_with_bible;
    const mappedExperience = experienceFromEnum(exp);

    // Map what_brings_you (could be string or array)
    const bringsVal = backend?.what_brings_you;
    const mappedBrings = Array.isArray(bringsVal)
      ? bringsVal
      : typeof bringsVal === 'string' && bringsVal.includes(',')
        ? bringsVal.split(',').map((s: string) => s.trim())
        : bringsVal
          ? [bringsVal]
          : [];

    // Map engagement_preference from backend enum to UI format
    const engageVal = backend?.engagement_preference;
    const mappedEngage = Array.isArray(engageVal)
      ? engageVal.map((e: string) => toTitleCase((e || '').toString()))
      : engageVal
        ? [toTitleCase((engageVal || '').toString())]
        : [];

    // Map explanation_style from backend to UI format
    const mappedExplainStyle = explanationStyleFromBackend(backend?.explanation_style);

    // Map bible_version from backend code to full UI format
    const bibleVersionCode = backend?.bible_version;
    const mappedTranslations = bibleVersionCode ? [titleForVersionCode(bibleVersionCode)] : [];

    setProfileData(prev => ({
      ...prev,
      firstName: u.first_name || '',
      lastName: u.last_name || '',
      experience: mappedExperience,
      brings: mappedBrings,
      engage: mappedEngage,
      explainStyle: mappedExplainStyle,
      translations: mappedTranslations,
      dailyPref: savedDailyPref,
      depth: mappedDepth,
    }));
  };

  // Restore state when modal opens
  useEffect(() => {
    if (isOpen) {
      // Priority: 1. Current User (so we get updates from PersonalizationCard)
      // 2. Saved Wizard State (if strictly needed, but for "Sync" we probably want fresh data)

      // To satisfy "Changes made in either place must immediately reflect", we MUST prefer currentUser.
      // However, we also want to remember the "Step" the user was on.

      if (currentUser) {
        hydrateFromUser(currentUser);
      }

      // Only load STEP from local storage, data should come from User to be safe/synced.
      const savedState = localStorage.getItem("profileSetupWizardState");
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          setCurrentStep(parsed.step || 0);
          // If we really want to support offline-ish resume where they typed but didn't save, we'd use parsed.data
          // But strict sync requirement implies we want what the backend has if it exists.
          // Let's stick to hydrating from User for the data fields.
        } catch (e) {
          console.error("Failed to parse saved wizard state", e);
        }
      }
    }
  }, [isOpen, currentUser]);

  const calculateProgress = (data: any) => {
    // Progress is ONLY based on First Name, Last Name, and Daily Preference
    let fields = [
      data.firstName,
      data.lastName,
      data.dailyPref,
    ];

    const filled = fields.filter(f => f && f !== "" && f !== 0).length;
    return Math.round((filled / fields.length) * 100);
  };

  // Update profile progress in real-time based on STEPS completed
  // This satisfies the requirement: "11% -> 50-60% -> 89% -> 100%" based on steps.
  useEffect(() => {
    if (isOpen) {
      // Formula: (Current Step Index + 1) / Total Steps * 100
      // Step 0 (1st step) = 1/9 = 11%
      // Step 8 (9th step) = 9/9 = 100%
      const progress = Math.round(((currentStep + 1) / steps.length) * 100);
      setProfileProgress(progress);
      // Persist to local storage so it shows on Home Page even after reload
      localStorage.setItem("profileProgress", String(progress));
    }
  }, [currentStep, isOpen]);

  const handleNext = async () => {
    // Validation Logic
    const currentStepId = steps[currentStep].id;
    let isValid = true;

    switch (currentStepId) {
      case 'name':
        if (!profileData.firstName.trim() || !profileData.lastName.trim()) {
          isValid = false;
        }
        break;
      case 'experience':
        if (!profileData.experience) {
          isValid = false;
        }
        break;
      case 'brings':
        if (profileData.brings.length === 0) {
          isValid = false;
        }
        break;
      case 'engage':
        if (profileData.engage.length === 0) {
          isValid = false;
        }
        break;
      case 'explainStyle':
        if (!profileData.explainStyle) {
          isValid = false;
        }
        break;
      case 'translations':
        if (profileData.translations.length === 0) {
          isValid = false;
        }
        break;
      case 'dailyPref':
        if (!profileData.dailyPref) {
          isValid = false;
        }
        break;
      case 'depth':
        if (!profileData.depth) {
          isValid = false;
        }
        break;
    }

    if (!isValid) {
      toast.error("Please fill this preference first.");
      return;
    }

    // Save on EVERY step to ensure sync
    try {
      await saveOrUpdateUserPreferences(profileData);

      // Update local storage state as well
      const wizardState = {
        step: currentStep + 1, // Store the NEXT step
        data: profileData
      };
      localStorage.setItem("profileSetupWizardState", JSON.stringify(wizardState));

    } catch (err) {
      console.error('Failed to save step progress', err);
      // Optional: block progress if save fails? usually better to let them proceed but warn?
      // For now, let's proceed but maybe show a subtle toast if needed, or just log.
    }

    if (currentStep === steps.length - 1) {
      // last step -> Complete
      try {
        // Clear wizard state on completion
        localStorage.removeItem("profileSetupWizardState");

        // Set progress to 100%
        setProfileProgress(100);
        localStorage.setItem("profileProgress", "100");

        toast.success(formatMessage({ id: 'PROFILE_SETUP.SETUP_COMPLETED' }));

        // Refresh dashboard to ensure everything is up to date (USER data)
        await refreshDashboard();

        if (profileData.dailyPref === 'Daily' && dashboardRefetch) {
          dashboardRefetch();
        }

        onClose();
      } catch (err) {
        toast.error(formatMessage({ id: 'PROFILE_SETUP.ERROR_SAVING' }));
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

  const handleClose = async () => {
    // Save current state to localStorage for resuming later
    const wizardState = {
      step: currentStep,
      data: profileData
    };
    localStorage.setItem("profileSetupWizardState", JSON.stringify(wizardState));

    // Calculate and save partial progress based on steps completed
    const progress = Math.round(((currentStep + 1) / steps.length) * 100);
    setProfileProgress(progress);
    localStorage.setItem("profileProgress", String(progress));

    // Also save to backend to ensure partial data is synced
    try {
      await saveOrUpdateUserPreferences(profileData);
    } catch (e) {
      console.error("Failed to save on close", e);
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
            <span>
              <FormattedMessage
                id="PROFILE_SETUP.STEP_PROGRESS"
                values={{ current: currentStep + 1, total: steps.length }}
              />
            </span>
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
            <FormattedMessage id="PROFILE_SETUP.BACK" />
          </button>

          <button
            onClick={handleNext}
            className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            {currentStep === steps.length - 1 ? <FormattedMessage id="PROFILE_SETUP.COMPLETE" /> : <FormattedMessage id="PROFILE_SETUP.NEXT" />}
            {currentStep < steps.length - 1 && <KeenIcon icon="right" className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export { ProfileSetupModal };





