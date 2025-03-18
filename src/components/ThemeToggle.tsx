
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative overflow-hidden"
    >
      <div className="w-6 h-6 relative">
        {/* Light mode logo (black part shows) */}
        <img 
          src="/lovable-uploads/e84a5028-2cdf-4169-9b00-e293114c2e25.png" 
          alt="Logo light mode" 
          className="absolute inset-0 w-full h-full transition-all duration-300 rotate-0 scale-100 dark:rotate-180 dark:scale-0"
        />
        {/* Dark mode logo (rotated) */}
        <img 
          src="/lovable-uploads/e84a5028-2cdf-4169-9b00-e293114c2e25.png" 
          alt="Logo dark mode" 
          className="absolute inset-0 w-full h-full transition-all duration-300 rotate-180 scale-0 dark:rotate-0 dark:scale-100"
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
