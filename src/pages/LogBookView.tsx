import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import LogBook from "@/components/LogBook";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import CoverPageForm from "@/components/CoverPageForm";

type Tab = "cover" | "entries";

const LogBookView = () => {
  const [activeTab, setActiveTab] = useState<Tab>("cover");

  const tabs: { id: Tab; label: string }[] = [
    { id: "cover", label: "Cover Page" },
    { id: "entries", label: "All Entries" },
  ];

  return (
    <AppLayout
      title="Log Book"
      subtitle="Your complete industrial attachment logbook"
      actions={
        <Button size="sm" className="gap-1.5">
          <FileDown className="h-4 w-4" />
          Export Full PDF
        </Button>
      }
    >
      {/* Tab strip */}
      <div className="-mx-6 -mt-6 mb-6 flex border-b border-border bg-card px-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              activeTab === t.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "cover" ? (
        <CoverPageForm
          onSubmit={() => {}}
          onCancel={() => setActiveTab("entries")}
        />
      ) : (
        <LogBook />
      )}
    </AppLayout>
  );
};

export default LogBookView;
