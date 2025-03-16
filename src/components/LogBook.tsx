
import { useState, useEffect } from "react";
import { getAllWeeklyLogs, WeeklyLog, deleteWeeklyLog, Task, saveCoverPageData } from "@/utils/storageUtils";
import { formatWeekRange, formatDate } from "@/utils/dateUtils";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { BookIcon, TrashIcon, FileTextIcon, DownloadIcon, GraduationCapIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import CoverPageForm from "./CoverPageForm";
import { generateLogbookPDF } from "@/utils/pdfGenerator";

const LogBook = () => {
  const [logs, setLogs] = useState<WeeklyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = () => {
    setLoading(true);
    const allLogs = getAllWeeklyLogs();
    // Sort logs by date, most recent first
    const sortedLogs = allLogs.sort((a, b) => {
      return new Date(b.compiledAt).getTime() - new Date(a.compiledAt).getTime();
    });
    setLogs(sortedLogs);
    setLoading(false);
  };

  const handleDeleteLog = (logId: string) => {
    deleteWeeklyLog(logId);
    loadLogs();
    
    toast({
      title: "Log deleted",
      description: "The weekly log has been removed from your logbook.",
      duration: 3000,
    });
  };

  const handleExportClick = () => {
    if (logs.length === 0) {
      toast({
        title: "No logs to export",
        description: "Add some tasks and weekly logs before exporting.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    setShowExportDialog(true);
  };

  const handleExportSubmit = async (coverData: any) => {
    try {
      setShowExportDialog(false);
      toast({
        title: "Generating PDF",
        description: "Please wait while we prepare your logbook...",
        duration: 3000,
      });

      // Save cover data for future use
      saveCoverPageData(coverData);
      
      // Sort logs chronologically for the PDF
      const chronologicalLogs = [...logs].sort((a, b) => {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      });

      // Generate PDF
      const pdfBlob = await generateLogbookPDF(chronologicalLogs, coverData);
      
      // Create a download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Internship_Logbook_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: "Your logbook has been downloaded.",
        duration: 3000,
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Export failed",
        description: "There was an error generating your logbook PDF.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  // Function to get all unique skills from tasks in a log
  const getLogSkills = (tasks: Task[]): string[] => {
    const skillsSet = new Set<string>();
    
    tasks.forEach(task => {
      if (task.skills && task.skills.length > 0) {
        task.skills.forEach(skill => skillsSet.add(skill));
      }
    });
    
    return Array.from(skillsSet);
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BookIcon className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-light">Weekly Logbook</h2>
        </div>
        
        <Button 
          variant="outline" 
          className="flex items-center space-x-2"
          onClick={handleExportClick}
        >
          <DownloadIcon className="h-4 w-4" />
          <span>Export Logbook</span>
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading your logs...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <BookIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-light mb-2">Your Logbook is Empty</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            You don't have any weekly logs yet. Add tasks during the week and they will be automatically compiled every Friday.
          </p>
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            <FileTextIcon className="h-4 w-4 mr-2" />
            Add Some Tasks
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="border-collapse w-full">
            <TableCaption>Your weekly task log records</TableCaption>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[250px] border border-border">Date</TableHead>
                <TableHead className="border border-border">Task Performed</TableHead>
                <TableHead className="w-[250px] border border-border">Skills applied / Learnt</TableHead>
                <TableHead className="w-[100px] border border-border text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/20">
                  <TableCell className="font-medium border border-border">
                    Week {log.weekNumber}: {formatWeekRange(new Date(log.startDate), new Date(log.endDate))}
                  </TableCell>
                  <TableCell className="border border-border">
                    {log.tasks.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {log.tasks.map((task, index) => (
                          <li key={task.id} className="text-sm">
                            {task.content}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted-foreground italic">No tasks recorded</span>
                    )}
                  </TableCell>
                  <TableCell className="border border-border">
                    {(() => {
                      const skills = getLogSkills(log.tasks);
                      
                      return skills.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {skills.map(skill => (
                            <Badge key={skill} variant="secondary" className="text-xs flex items-center gap-1">
                              <GraduationCapIcon className="h-3 w-3" />
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <div className="flex justify-center items-center h-full">
                          <span className="text-muted-foreground italic text-sm">No skills recorded</span>
                        </div>
                      );
                    })()}
                  </TableCell>
                  <TableCell className="border border-border text-center">
                    <div className="flex justify-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <FileTextIcon className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Weekly Log Details</DialogTitle>
                            <DialogDescription>
                              Week {log.weekNumber}, {log.year} • {formatWeekRange(new Date(log.startDate), new Date(log.endDate))}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="mt-4 space-y-4">
                            {log.tasks.length > 0 ? (
                              Object.entries(
                                log.tasks.reduce<Record<string, typeof log.tasks>>((acc, task) => {
                                  const dayStr = task.date.split('T')[0];
                                  if (!acc[dayStr]) acc[dayStr] = [];
                                  acc[dayStr].push(task);
                                  return acc;
                                }, {})
                              ).map(([dayStr, dayTasks]) => (
                                <div key={dayStr} className="bg-muted/40 p-4 rounded-lg">
                                  <h4 className="font-medium mb-2">
                                    {formatDate(new Date(dayStr), "EEEE, MMMM d")}
                                  </h4>
                                  <ul className="space-y-2">
                                    {dayTasks.map(task => (
                                      <li key={task.id} className="text-sm pb-2 border-b border-border last:border-0 last:pb-0">
                                        <div>{task.content}</div>
                                        {task.skills && task.skills.length > 0 && (
                                          <div className="mt-1 flex flex-wrap gap-1">
                                            {task.skills.map(skill => (
                                              <Badge key={skill} variant="outline" className="text-xs">
                                                {skill}
                                              </Badge>
                                            ))}
                                          </div>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-6">
                                <p className="text-muted-foreground">No tasks found in this log.</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-6">
                            <Separator className="mb-4" />
                            <div className="text-xs text-muted-foreground">
                              Compiled on {formatDate(new Date(log.compiledAt), "MMMM d, yyyy 'at' h:mm a")}
                            </div>
                          </div>
                          
                          <DialogClose asChild>
                            <Button className="mt-4" variant="outline">Close</Button>
                          </DialogClose>
                        </DialogContent>
                      </Dialog>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Weekly Log</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this weekly log? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteLog(log.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Export Internship Logbook</DialogTitle>
            <DialogDescription>
              Enter details for your logbook cover page. This information will appear on the first page of your exported PDF.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <CoverPageForm 
              onSubmit={handleExportSubmit}
              onCancel={() => setShowExportDialog(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LogBook;
