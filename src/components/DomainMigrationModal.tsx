import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

const NEW_DOMAIN = "https://unilogbook.genesisoft.co.zw";

const DomainMigrationModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show modal on every page load
    setIsOpen(true);
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
  };

  const handleGoToNewDomain = () => {
    window.location.href = NEW_DOMAIN;
  };

  const handleRemindLater = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        className="sm:max-w-[500px] gap-6"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-blue-100 dark:bg-blue-900">
            <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <DialogTitle className="text-2xl text-center">
            Important: We're Moving!
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Our service is migrating to a new domain. Please update your bookmarks and visit us at:
          </DialogDescription>
          <div className="p-4 rounded-lg bg-muted">
            <a
              href={NEW_DOMAIN}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium break-all text-center block"
            >
              {NEW_DOMAIN}
            </a>
          </div>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={handleRemindLater}
            className="w-full sm:w-auto order-3 sm:order-1"
          >
            Remind Me Later
          </Button>
          <Button
            variant="secondary"
            onClick={handleDismiss}
            className="w-full sm:w-auto order-2 sm:order-2"
          >
            Dismiss
          </Button>
          <Button
            onClick={handleGoToNewDomain}
            className="w-full sm:w-auto order-1 sm:order-3"
          >
            Go to New Domain
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DomainMigrationModal;
