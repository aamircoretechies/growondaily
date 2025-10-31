import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, Check, ChevronRight, ListChecks, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '@/auth/providers/JWTProvider';
import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

type RowProps = {
  title: string;
  subtitle: string;
  onClick?: () => void;
};

const Row = ({ title, subtitle, onClick }: RowProps) => (
  <button type="button" onClick={onClick} className="w-full text-left bg-sand rounded-xl">
    <div className="flex items-center justify-between px-4 py-4 rounded-xl bg-white/90 hover:bg-white dark:bg-[--tw-page-bg-dark] dark:hover:bg-[--tw-page-bg-dark] transition-colors">
      <div className="flex-1 min-w-0 pr-2">
        <div className="text-[15px] text-primary break-words">{title}</div>
        <div className="text-sm text-gray-500 break-words">{subtitle}</div>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
    </div>
  </button>
);

const PersonalizationCard = ({ user }: { user: any }) => {
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [experienceOpen, setExperienceOpen] = useState(false);
  const [experience, setExperience] = useState<'First Time' | 'Occasional' | 'Regular' | 'Theological'>('First Time');
  const [bringsOpen, setBringsOpen] = useState(false);
  const bringsOptions = [
    'To better understand what I read',
    'To learn about faith and God',
    'For daily inspiration or peace',
    'For study or lesson preparation',
    'Just curious'
  ] as const;
  const [brings, setBrings] = useState<string[]>([
    'To better understand what I read',
    'For daily inspiration or peace'
  ]);
  const toggleBrings = (option: string) => {
    setBrings((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };
  const [engageOpen, setEngageOpen] = useState(false);
  const engageOptions = [
    'Reading',
    'Listening',
    'Speaking',
    'Step-by-step guidance'
  ] as const;
  const [engage, setEngage] = useState<string[]>(['Reading', 'Speaking']);
  const toggleEngage = (option: string) => {
    setEngage((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };
  const [explainOpen, setExplainOpen] = useState(false);
  const explainOptions = [
    'Clear and simple language',
    'A bit deeper with context',
    'Mixed depending on topic',
    "I'll decide later"
  ] as const;
  const [explain, setExplain] = useState<(typeof explainOptions)[number]>('Clear and simple language');
  const [translationsOpen, setTranslationsOpen] = useState(false);
  const [translationQuery, setTranslationQuery] = useState('');
  const translationOptions = [
    'KJV - King James Version',
    'NKJV - New King James Version',
    'NIV - New International Version',
    'NLT - New Living Translation',
    'ESV - English Standard Version',
    'CSB - Christian Standard Bible',
    'NASB - New American Standard Bible',
    'NASB95 - New American Standard Bible 1995',
    'NRSV - New Revised Standard Version',
    'RSV - Revised Standard Version',
    'CEB - Common English Bible',
    'CEV - Contemporary English Version',
    'GNT - Good News Translation',
    'AMP - Amplified Bible',
    'NET - New English Translation',
    'HCSB - Holman Christian Standard Bible',
    'ASV - American Standard Version',
    'ERV - Easy-to-Read Version',
    'WEB - World English Bible',
    'YLT - Young’s Literal Translation',
    'BBE - Bible in Basic English',
    'TLB - The Living Bible',
    'MSG - The Message',
    'Douay-Rheims (DRB)',
    'Wycliffe Bible',
    'Geneva Bible',
    'JPS Tanakh 1917',
    'Septuagint (LXX, English)',
    'Vulgate (Latin)',
    'RVR1960 - Reina-Valera 1960 (Spanish)',
    'RVR1995 - Reina-Valera 1995 (Spanish)',
    'NVI - Nueva Versión Internacional (Spanish)',
    'LBLA - La Biblia de las Américas (Spanish)',
    'DHH - Dios Habla Hoy (Spanish)',
    'Louis Segond (French)',
    'Segond 21 (French)',
    'La Bible du Semeur (French)',
    'Lutherbibel 2017 (German)',
    'Schlachter 2000 (German)',
    'Elberfelder (German)',
    'Almeida Revista e Atualizada (Portuguese ARA)',
    'Almeida Revista e Corrigida (Portuguese ARC)',
    'Biblia Tysiąclecia (Polish)',
    'Biblia Warszawska (Polish)',
    'Русский Синодальный Перевод (Russian Synodal)',
    'Современный Русский Перевод (Russian CARS)',
    '中文和合本 (Chinese CUV)',
    '新譯本 (Chinese CNV)',
    '한국어 개역개정 (Korean RVRK)',
    '日本語口語訳 (Japanese Kougo Yaku)',
    'Hindi - आसान बाइबल (ERV-HI)'
  ] as const; 
  const [translations, setTranslations] = useState<string[]>(['KJV - King James Version']);
  const toggleTranslation = (option: string) => {
    setTranslations((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };
  const [dailyOpen, setDailyOpen] = useState(false);
  const [dailyPref, setDailyPref] = useState<'Daily' | 'Occasionally'>('Daily');
  const [depthOpen, setDepthOpen] = useState(false);
  const depthOptions = [
    'Short (1-2 min read)',
    'Medium (3-4 min read)',
    'Deep dive (5+ min read)'
  ] as const;
  const [depth, setDepth] = useState<(typeof depthOptions)[number]>('Short (1-2 min read)');

  // Map backend enums or human-readable phrases -> UI labels
  const experienceFromEnum = (val?: string): 'First Time' | 'Occasional' | 'Regular' | 'Theological' => {
    const v = (val || '').toString();
    const up = v.toUpperCase();
    if (up === 'FIRST_TIME' || up === 'NEW_TO_BIBLE') return 'First Time';
    if (up === 'OCCASIONAL' || up === 'SOME_KNOWLEDGE') return 'Occasional';
    if (up === 'REGULAR' || up === 'REGULAR_STUDY') return 'Regular';
    if (up === 'THEOLOGICAL' || up === 'ADVANCED_THEOLOGY') return 'Theological';
    const norm = v.trim().toLowerCase();
    if (norm.includes('new')) return 'First Time';
    if (norm.includes('some')) return 'Occasional';
    if (norm.includes('regular')) return 'Regular';
    if (norm.includes('advanced') || norm.includes('theolog')) return 'Theological';
    return 'First Time';
  };

  const titleForVersionCode = (code?: string) => {
    const c = (code || '').toUpperCase();
    const match = translationOptions.find((o) => o.startsWith(`${c} `));
    return match || 'KJV - King James Version';
  };

  const toTitleCase = (s: string) => s
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const hydrateFromUser = (u: any) => {
    if (!u) return;

    // 1) If raw UI-shaped prefs exist (string or object), prefer them
    const rawPrefs = u.prefs || u.preferences_json || u.preference_json;
    if (rawPrefs) {
      try {
        const prefs = typeof rawPrefs === 'string' ? JSON.parse(rawPrefs) : rawPrefs;
        setExperience(prefs.experience || 'First Time');
        setBrings(Array.isArray(prefs.brings) ? prefs.brings : prefs.brings ? [prefs.brings] : []);
        setEngage(Array.isArray(prefs.engage) ? prefs.engage : prefs.engage ? [prefs.engage] : []);
        setExplain(prefs.explain || 'Clear and simple language');
        setTranslations(
          Array.isArray(prefs.translations)
            ? prefs.translations
            : prefs.translations
            ? [prefs.translations]
            : ['KJV - King James Version']
        );
        setDailyPref(prefs.dailyPref || 'Daily');
        setDepth(prefs.depth || 'Short (1-2 min read)');
        return;
      } catch {}
    }

    // 2) Otherwise, try backend canonical fields mapping
    const backend = u.preferences || u.preference || u.user_preferences || u.settings?.preferences;
    if (backend && typeof backend === 'object') {
      // depth_level -> UI text
      const depthLevel = (backend.depth_level || '').toString().toLowerCase();
      setDepth(
        depthLevel === 'short'
          ? 'Short (1-2 min read)'
          : depthLevel === 'medium'
          ? 'Medium (3-4 min read)'
          : 'Deep dive (5+ min read)'
      );

      // experience_with_bible -> ['FIRST_TIME'] etc.
      const exp = Array.isArray(backend.experience_with_bible)
        ? backend.experience_with_bible[0]
        : backend.experience_with_bible;
      setExperience(experienceFromEnum(exp));

      // what_brings_you: could be string or array
      const bringsVal = backend.what_brings_you;
      setBrings(
        Array.isArray(bringsVal)
          ? bringsVal
          : typeof bringsVal === 'string' && bringsVal.includes(',')
          ? bringsVal.split(',').map((s: string) => s.trim())
          : bringsVal
          ? [bringsVal]
          : []
      );

      // engagement_preference: ['READING', 'LISTENING'] -> ['Reading', ...]
      const engageVal = backend.engagement_preference;
      setEngage(
        Array.isArray(engageVal)
          ? engageVal.map((e: string) => toTitleCase((e || '').toString()))
          : engageVal
          ? [toTitleCase((engageVal || '').toString())]
          : []
      );

      // explanation_style -> UI option
      const style = (backend.explanation_style || '').toString().toLowerCase();
      setExplain(
        style === 'simple'
          ? 'Clear and simple language'
          : style === 'deep'
          ? 'A bit deeper with context'
          : 'Mixed depending on topic'
      );

      // bible_version code -> full title if possible
      setTranslations([titleForVersionCode(backend.bible_version)]);

      // receive_daily -> UI
      setDailyPref(backend.receive_daily ? 'Daily' : 'Occasionally');
    }
  };

  useEffect(() => {
    hydrateFromUser(user);
  }, [user]);

  // Also hydrate when context user changes (page refresh path)
  const authContext = useContext(AuthContext);
  useEffect(() => {
    if (authContext?.currentUser) {
      hydrateFromUser(authContext.currentUser);
    }
  }, [authContext?.currentUser]);



  
  const handleSave = async () => {
    const preferences = {
      experience,
      brings,
      engage,
      explain,
      translations,
      dailyPref,
      depth,
    };

    try {
      if (authContext?.saveOrUpdateUserPreferences) {
        await authContext.saveOrUpdateUserPreferences(preferences);
      } else if (authContext?.saveUserPreferences) {
        await authContext.saveUserPreferences(preferences);
      }
      const updatedUser = await authContext?.getUser();
      authContext?.setCurrentUser(updatedUser);
      alert("Preferences saved successfully!");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save preferences. Please try again.");
    }
  };

  return (
    <Card id="personalization" className='bg-white/40 dark:bg-gray-100 '>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="w-5 h-5" />
          Personalization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Row
          title="What is your experience with Bible?"
          subtitle={experience}
          onClick={() => setExperienceOpen(true)}
        />
        <Row
          title="What brings you to this app?"
          subtitle={brings.join(', ') || 'Select one or more'}
          onClick={() => setBringsOpen(true)}
        />
        <Row
          title="How do you prefer to engage with the Bible?"
          subtitle={engage.join(', ') || 'Select one or more'}
          onClick={() => setEngageOpen(true)}
        />
        <Row
          title="What explanation style do you prefer?"
          subtitle={explain}
          onClick={() => setExplainOpen(true)}
        />
        <Row
          title="Which Bible translation do you prefer?"
          subtitle={translations.join(', ')}
          onClick={() => setTranslationsOpen(true)}
        />
        <Row
          title="Would you like to receive a daily verse or reflection?"
          subtitle={dailyPref === 'Daily' ? 'Yes, Daily' : 'Occasionally'}
          onClick={() => setDailyOpen(true)}
        />
        <Row
          title="How deep should each reflection be?"
          subtitle={depth}
          onClick={() => setDepthOpen(true)}
        />

        <button type="button" onClick={() => setFeaturesOpen(true)} className="w-full text-left bg-sand rounded-xl">
          <div className="flex items-center justify-between px-4 py-4 rounded-xl bg-white/90 hover:bg-white dark:bg-[--tw-page-bg-dark] dark:hover:bg-[--tw-page-bg-dark] transition-colors">
            <div>
              <div className="text-[15px] text-primary">Reflection Features</div>
              <div className="text-sm text-gray-500">Enable or Disable</div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </button>

        <Dialog open={featuresOpen} onOpenChange={() => setFeaturesOpen(false)}>
          <DialogContent className="max-w-sm sm:max-w-md lg:max-w-xl">
            <DialogHeader>
              <DialogTitle>Reflection Features</DialogTitle>
            </DialogHeader>
            <DialogBody className="space-y-4">
              {[
                ['Historical Context', 'Background information and relevant...'],
                ['Ground Text Analysis', 'Insights from the original Hebrew..'],
                ['Special Insights', 'Surprising or lesser-known facts'],
                ['Daily Life Application', 'Practical guidance for living out the..'],
                ['Cross-References', 'Related Bible verses for deeper study'],
                ['Commentary Insights', 'Explanations or interpretations from..'],
                ['Key Takeaways', "Points summarizing the passage’s..."],
                ['Reflection Prompts', 'Questions or prayer suggestions...']
              ].map(([title, subtitle]) => (
                <div key={title as string} className="flex items-center justify-between px-3 py-3 rounded-xl bg-white/80 dark:bg-[--tw-page-bg-dark]">
                  <div>
                    <div className="text-[15px] text-primary">{title as string}</div>
                    <div className="text-sm text-gray-500">{subtitle as string}</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </DialogBody>
          </DialogContent>
        </Dialog>

        <Dialog open={experienceOpen} onOpenChange={() => setExperienceOpen(false)}>
          <DialogContent className="max-w-sm sm:max-w-md">
            <DialogHeader>
              <DialogTitle>What is your experience with Bible?</DialogTitle>
            </DialogHeader>
            <DialogBody className="space-y-2">
              {(['First Time', 'Occasional', 'Regular', 'Theological'] as const).map((option) => {
                const selected = experience === option;
                return (
                  <button
                    type="button"
                    key={option}
                    onClick={() => {
                      setExperience(option);
                      setExperienceOpen(false);
                    }}
                    className={`w-full text-left rounded-xl transition-colors ${selected ? 'bg-sand dark:bg-[--tw-page-bg-dark]' : 'dark:bg-[--tw-page-bg-dark]'} `}
                  >
                    <div className="flex items-center justify-between px-4 py-4 rounded-xl bg-white/90 hover:bg-white dark:bg-[--tw-page-bg-dark] dark:hover:bg-[--tw-page-bg-dark]">
                      <div className="text-[15px] text-primary">{option}</div>
                      {selected && <Check className="w-4 h-4 text-primary" />}
                    </div>
                  </button>
                );
              })}
            </DialogBody>
          </DialogContent>
        </Dialog>

        <Dialog open={bringsOpen} onOpenChange={() => setBringsOpen(false)}>
          <DialogContent className="max-w-sm sm:max-w-md">
            <DialogHeader>
              <DialogTitle>What brings you to this app?</DialogTitle>
            </DialogHeader>
            <DialogBody className="space-y-2">
              {bringsOptions.map((option) => {
                const selected = brings.includes(option);
                return (
                  <button
                    type="button"
                    key={option}
                    onClick={() => toggleBrings(option)}
                    className={`w-full text-left rounded-xl transition-colors ${selected ? 'bg-sand dark:bg-[--tw-page-bg-dark]' : 'dark:bg-[--tw-page-bg-dark]'} `}
                  >
                    <div className="flex items-center justify-between px-4 py-4 rounded-xl bg-white/90 hover:bg-white dark:bg-[--tw-page-bg-dark] dark:hover:bg-[--tw-page-bg-dark]">
                      <div className="text-[15px] text-primary">{option}</div>
                      {selected && <Check className="w-4 h-4 text-primary" />}
                    </div>
                  </button>
                );
              })}
            </DialogBody>
          </DialogContent>
        </Dialog>

        <Dialog open={engageOpen} onOpenChange={() => setEngageOpen(false)}>
          <DialogContent className="max-w-sm sm:max-w-md">
            <DialogHeader>
              <DialogTitle>How do you prefer to engage with the Bible?</DialogTitle>
            </DialogHeader>
            <DialogBody className="space-y-2">
              {engageOptions.map((option) => {
                const selected = engage.includes(option);
                return (
                  <button
                    type="button"
                    key={option}
                    onClick={() => toggleEngage(option)}
                    className={`w-full text-left rounded-xl transition-colors ${selected ? 'bg-sand dark:bg-[--tw-page-bg-dark]' : 'dark:bg-[--tw-page-bg-dark]'} `}
                  >
                    <div className="flex items-center justify-between px-4 py-4 rounded-xl bg-white/90 hover:bg-white dark:bg-[--tw-page-bg-dark] dark:hover:bg-[--tw-page-bg-dark]">
                      <div className="text-[15px] text-primary">{option}</div>
                      {selected && <Check className="w-4 h-4 text-primary" />}
                    </div>
                  </button>
                );
              })}
            </DialogBody>
          </DialogContent>
        </Dialog>

        <Dialog open={explainOpen} onOpenChange={() => setExplainOpen(false)}>
          <DialogContent className="max-w-sm sm:max-w-md">
            <DialogHeader>
              <DialogTitle>What explanation style do you prefer?</DialogTitle>
            </DialogHeader>
            <DialogBody className="space-y-2">
              {explainOptions.map((option) => {
                const selected = explain === option;
                return (
                  <button
                    type="button"
                    key={option}
                    onClick={() => {
                      setExplain(option);
                      setExplainOpen(false);
                    }}
                    className={`w-full text-left rounded-xl transition-colors ${selected ? 'bg-sand dark:bg-[--tw-page-bg-dark]' : 'dark:bg-[--tw-page-bg-dark]'} `}
                  >
                    <div className="flex items-center justify-between px-4 py-4 rounded-xl bg-white/90 hover:bg-white dark:bg-[--tw-page-bg-dark] dark:hover:bg-[--tw-page-bg-dark]">
                      <div className="text-[15px] text-primary">{option}</div>
                      {selected && <Check className="w-4 h-4 text-primary" />}
                    </div>
                  </button>
                );
              })}
            </DialogBody>
          </DialogContent>
        </Dialog>

        <Dialog open={translationsOpen} onOpenChange={() => setTranslationsOpen(false)}>
          <DialogContent className="max-w-sm sm:max-w-md lg:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Which Bible translation do you prefer?</DialogTitle>
            </DialogHeader>
            <DialogBody className="space-y-3">
              <div className="px-3">
                <input
                  type="text"
                  placeholder="Search translations..."
                  value={translationQuery}
                  onChange={(e) => setTranslationQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="max-h-[420px] overflow-auto space-y-2 pr-1">
                {translationOptions
                  .filter((o) => o.toLowerCase().includes(translationQuery.toLowerCase()))
                  .map((option) => {
                    const selected = translations.includes(option);
                    return (
                      <button
                        type="button"
                        key={option}
                        onClick={() => toggleTranslation(option)}
                        className={`w-full text-left rounded-xl transition-colors ${selected ? 'bg-sand dark:bg-[--tw-page-bg-dark]' : 'dark:bg-[--tw-page-bg-dark]'} `}
                      >
                        <div className="flex items-center justify-between px-4 py-4 rounded-xl bg-white/90 hover:bg-white dark:bg-[--tw-page-bg-dark] dark:hover:bg-[--tw-page-bg-dark]">
                          <div className="text-[15px] text-primary">{option}</div>
                          {selected && <Check className="w-4 h-4 text-primary" />}
                        </div>
                      </button>
                    );
                  })}
              </div>
            </DialogBody>
          </DialogContent>
        </Dialog>

        <Dialog open={dailyOpen} onOpenChange={() => setDailyOpen(false)}>
          <DialogContent className="max-w-sm sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Would you like to receive a daily verse or reflection?</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <div className="grid grid-cols-2 gap-4 p-2">
                {[
                  { key: 'Daily' as const, label: 'Yes, Daily', icon: Sun },
                  { key: 'Occasionally' as const, label: 'Occasionally', icon: CalendarClock }
                ].map(({ key, label, icon: Icon }) => {
                  const selected = dailyPref === key;
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => {
                        setDailyPref(key);
                        setDailyOpen(false);
                      }}
                      className={`rounded-xl border transition-colors text-center py-8 ${selected ? 'bg-sand border-transparent' : 'border-gray-200 bg-white/90 hover:bg-white'
                        }`}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Icon className="w-8 h-8 text-primary/80" />
                        <span className="text-[15px] text-primary">{label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </DialogBody>
          </DialogContent>
        </Dialog>

        <Dialog open={depthOpen} onOpenChange={() => setDepthOpen(false)}>
          <DialogContent className="max-w-sm sm:max-w-md">
            <DialogHeader>
              <DialogTitle>How deep should each reflection be?</DialogTitle>
            </DialogHeader>
            <DialogBody className="space-y-2">
              {depthOptions.map((option) => {
                const selected = depth === option;
                return (
          <button
                    type="button"
                    key={option}
                    onClick={() => {
                      setDepth(option);
                      setDepthOpen(false);
                    }}
                    className={`w-full text-left rounded-xl transition-colors ${selected ? 'bg-sand dark:bg-[--tw-page-bg-dark]' : 'dark:bg-[--tw-page-bg-dark]'} `}
                  >
                    <div className="flex items-center justify-between px-4 py-4 rounded-xl bg-white/90 hover:bg-white dark:bg-[--tw-page-bg-dark] dark:hover:bg-[--tw-page-bg-dark]">
                      <div className="text-[15px] text-primary">{option}</div>
                      {selected && <Check className="w-4 h-4 text-primary" />}
                    </div>
          </button>
                );
              })}
            </DialogBody>
          </DialogContent>
        </Dialog>
        <div className="pt-4 text-center">
          <Button onClick={handleSave} className="bg-primary text-white px-5 py-2 rounded-xl">
            Save Changes
          </Button>
        </div>

      </CardContent>
    </Card>
  );
};

export { PersonalizationCard };





