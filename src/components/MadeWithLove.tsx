
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

const MadeWithLove = () => {
  const isMobile = useIsMobile();
  const [showMobilePopup, setShowMobilePopup] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  
  useEffect(() => {
    if (isMobile && !dismissed) {
      // Show popup after 5 seconds on mobile
      const timer = setTimeout(() => {
        setShowMobilePopup(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isMobile, dismissed]);

  const handleExternalLink = () => {
    window.open('https://www.genesisoft.co.zw', '_blank', 'noopener,noreferrer');
  };

  const handleDismiss = () => {
    setShowMobilePopup(false);
    setDismissed(true);
  };

  if (isMobile) {
    if (!showMobilePopup || dismissed) return null;
    
    return (
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-card shadow-lg rounded-lg p-4 flex flex-col items-center animate-fade-in">
          <div className="flex items-center mb-2">
            <span>Made with </span>
            <Heart className="h-4 w-4 mx-1 text-red-500 fill-red-500" />
            <span> by </span>
            <span 
              className="font-semibold cursor-pointer hover:text-primary"
              onClick={handleExternalLink}
            >
              Genesisoft
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={handleDismiss}>
            Dismiss
          </Button>
        </div>
      </div>
    );
  }

  // For desktop: show as a small footer
  return (
    <div className="fixed bottom-2 right-2 z-30">
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors">
            <span>Made with </span>
            <Heart className="h-3 w-3 mx-0.5 text-red-500 fill-red-500" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" side="top" align="end">
          <div className="text-sm flex items-center">
            <span>Made with </span>
            <Heart className="h-4 w-4 mx-1 text-red-500 fill-red-500" />
            <span> by </span>
            <span 
              className="font-semibold cursor-pointer hover:text-primary"
              onClick={handleExternalLink}
            >
              Genesisoft
            </span>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MadeWithLove;
