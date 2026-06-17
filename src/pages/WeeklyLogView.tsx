import AppLayout from "@/components/AppLayout";
import WeeklyLog from "@/components/WeeklyLog";

const WeeklyLogView = () => {
  return (
    <AppLayout
      title="Weekly Summary"
      subtitle="View and compile your weekly task summaries"
    >
      <WeeklyLog />
    </AppLayout>
  );
};

export default WeeklyLogView;
