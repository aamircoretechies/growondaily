import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container } from '@/components/container';
import { BibleContent, DeepStudy, VerseStudy } from '.';

const BiblePage = () => {
  const [searchParams] = useSearchParams();
  const [showDeepStudy, setShowDeepStudy] = useState(false);

  // Check if we're viewing a specific verse
  const isVerseView = searchParams.get('bible') && searchParams.get('chapter') && searchParams.get('verse');

  // Listen for deep study toggle from sidebar
  useEffect(() => {
    const handleDeepStudyToggle = (event: any) => {
      console.log('Deep study toggle event received:', event.detail);
      if (event.detail.action === 'toggleDeepStudy') {
        // Only allow deep study toggle when not viewing a specific verse
        if (!isVerseView) {
          setShowDeepStudy(event.detail.enabled);
        }
      }
    };

    window.addEventListener('deepStudyToggle', handleDeepStudyToggle);
    
    return () => {
      window.removeEventListener('deepStudyToggle', handleDeepStudyToggle);
    };
  }, [isVerseView]);

  // Reset deep study state when switching to verse view
  useEffect(() => {
    if (isVerseView) {
      setShowDeepStudy(false);
    }
  }, [isVerseView]);

  return (
    <Container>
      <div className="space-y-6">
        {/* Verse Study - Show when specific verse is clicked */}
        {isVerseView && <VerseStudy />}
        
        {/* Bible Content - Show when no specific verse is selected */}
        {!isVerseView && !showDeepStudy && (
          <BibleContent 
            showDeepStudyButton={true}
            onDeepStudyToggle={() => setShowDeepStudy(!showDeepStudy)}
            isDeepStudyActive={showDeepStudy}
          />
        )}
        
        {/* Deep Study - Toggleable from sidebar, but hidden when viewing specific verse */}
        {!isVerseView && showDeepStudy && (
        
            <DeepStudy 
              showDeepStudyButton={true}
              onDeepStudyToggle={() => setShowDeepStudy(!showDeepStudy)}
              isDeepStudyActive={showDeepStudy}
            />
        
        )}
      </div>
    </Container>
  );
};

export { BiblePage };
