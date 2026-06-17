import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

const AppLayout = ({ children, title, subtitle, actions }: AppLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="ml-52 flex flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card px-6">
          <div>
            <h1 className="text-base font-bold text-foreground leading-tight">{title}</h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2">{actions}</div>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 bg-background p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
