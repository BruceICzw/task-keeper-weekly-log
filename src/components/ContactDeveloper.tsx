import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ContactDeveloper() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Contact Developer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Developer</DialogTitle>
          <DialogDescription>
            Get in touch with the developer for support or feature requests.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>You can contact the developer at:</p>
          <a href="mailto:chigwabruce@gmail.com" className="font-medium">chigwabruce@gmail.com</a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
