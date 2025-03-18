
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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
          <p className="font-medium">developer@example.com</p>
          <p>Or visit the GitHub repository for issues and feature requests:</p>
          <a 
            href="https://github.com/developer/uni-log-book-creator" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            GitHub Repository
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}
