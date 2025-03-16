
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Task, WeeklyLog } from "@/utils/storageUtils";
import { formatDate, formatWeekRange } from "@/utils/dateUtils";

interface CoverPageData {
  studentName: string;
  studentId: string;
  institution: string;
  department: string;
  companyName: string;
  supervisorName: string;
  startDate: string;
  endDate: string;
  institutionLogo: string | null;
  companyLogo: string | null;
}

export const generateLogbookPDF = async (
  logs: WeeklyLog[],
  coverData: CoverPageData
): Promise<Blob> => {
  // Create PDF document (A4 size)
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  
  // Add cover page
  addCoverPage(doc, coverData, pageWidth, pageHeight, margin);
  
  // Add table of contents
  doc.addPage();
  addTableOfContents(doc, logs, margin);
  
  // Add logs content page by page
  logs.forEach((log, index) => {
    doc.addPage();
    addLogPage(doc, log, margin, pageWidth);
  });
  
  // Save PDF as blob
  const pdfBlob = doc.output('blob');
  return pdfBlob;
};

const addCoverPage = (
  doc: jsPDF, 
  coverData: CoverPageData, 
  pageWidth: number, 
  pageHeight: number, 
  margin: number
) => {
  const centerX = pageWidth / 2;
  
  // Add institution logo if available
  if (coverData.institutionLogo) {
    doc.addImage(
      coverData.institutionLogo, 
      'PNG', 
      margin, 
      margin, 
      70, 
      30, 
      'institution_logo', 
      'FAST'
    );
  }
  
  // Add company logo if available
  if (coverData.companyLogo) {
    doc.addImage(
      coverData.companyLogo, 
      'PNG', 
      pageWidth - margin - 70, 
      margin, 
      70, 
      30, 
      'company_logo', 
      'FAST'
    );
  }
  
  // Add title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('INTERNSHIP LOGBOOK', centerX, 90, { align: 'center' });
  
  // Add student details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  const startY = 120;
  const lineHeight = 10;
  
  doc.text(`Student Name: ${coverData.studentName}`, centerX, startY, { align: 'center' });
  doc.text(`Student ID: ${coverData.studentId}`, centerX, startY + lineHeight, { align: 'center' });
  doc.text(`Institution: ${coverData.institution}`, centerX, startY + lineHeight * 2, { align: 'center' });
  doc.text(`Department: ${coverData.department}`, centerX, startY + lineHeight * 3, { align: 'center' });
  
  // Add horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, startY + lineHeight * 4, pageWidth - margin, startY + lineHeight * 4);
  
  // Add company details
  doc.text(`Company: ${coverData.companyName}`, centerX, startY + lineHeight * 5, { align: 'center' });
  doc.text(`Supervisor: ${coverData.supervisorName}`, centerX, startY + lineHeight * 6, { align: 'center' });
  
  // Add internship period
  const startDate = new Date(coverData.startDate);
  const endDate = new Date(coverData.endDate);
  doc.text(
    `Internship Period: ${formatDate(startDate, 'MMMM d, yyyy')} - ${formatDate(endDate, 'MMMM d, yyyy')}`,
    centerX,
    startY + lineHeight * 8,
    { align: 'center' }
  );
  
  // Add footer
  doc.setFontSize(10);
  doc.text(
    `Generated on ${formatDate(new Date(), 'MMMM d, yyyy')}`,
    centerX,
    pageHeight - margin,
    { align: 'center' }
  );
};

const addTableOfContents = (doc: jsPDF, logs: WeeklyLog[], margin: number) => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Table of Contents', margin, margin);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  
  let y = margin + 15;
  const lineHeight = 7;
  
  // Add TOC entries
  doc.text('1. Cover Page', margin, y);
  y += lineHeight;
  doc.text('2. Weekly Logs:', margin, y);
  y += lineHeight;
  
  logs.forEach((log, index) => {
    const weekStart = new Date(log.startDate);
    const weekEnd = new Date(log.endDate);
    const weekRangeText = formatWeekRange(weekStart, weekEnd);
    doc.text(`   ${index + 1}. Week ${log.weekNumber} (${weekRangeText})`, margin + 5, y);
    y += lineHeight;
  });
};

const addLogPage = (doc: jsPDF, log: WeeklyLog, margin: number, pageWidth: number) => {
  const weekStart = new Date(log.startDate);
  const weekEnd = new Date(log.endDate);
  
  // Add week header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(`Week ${log.weekNumber}: ${formatWeekRange(weekStart, weekEnd)}`, margin, margin);
  
  // Add table of tasks
  const tableStartY = margin + 10;
  
  if (log.tasks.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(12);
    doc.text('No tasks recorded for this week', margin, tableStartY + 10);
    return;
  }
  
  // Group tasks by day
  const tasksByDay: { [key: string]: Task[] } = {};
  log.tasks.forEach(task => {
    const dayStr = task.date.split('T')[0];
    if (!tasksByDay[dayStr]) {
      tasksByDay[dayStr] = [];
    }
    tasksByDay[dayStr].push(task);
  });
  
  // Process table data
  const tableData: Array<string[]> = [];
  
  Object.entries(tasksByDay).forEach(([dayStr, dayTasks]) => {
    const dayDate = new Date(dayStr);
    const dateStr = formatDate(dayDate, 'EEEE, MMMM d, yyyy');
    
    // Add each task for this day
    dayTasks.forEach((task, taskIndex) => {
      // Only show date on first task of the day
      const dateCell = taskIndex === 0 ? dateStr : '';
      
      // Combine skills into comma-separated string
      const skillsStr = task.skills && task.skills.length > 0
        ? task.skills.join(', ')
        : '';
      
      tableData.push([dateCell, task.content, skillsStr]);
    });
  });
  
  // Define table headers and styling
  autoTable(doc, {
    startY: tableStartY,
    head: [['Date', 'Task Performed', 'Skills Applied / Learnt']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [80, 80, 80],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 50 }, // Date column
      1: { cellWidth: 'auto' }, // Task column
      2: { cellWidth: 60 }, // Skills column
    },
    styles: {
      overflow: 'linebreak',
      cellPadding: 3,
    },
    margin: { left: margin, right: margin },
  });
  
  // Add footer
  // Fix: Use the correct API to get page count
  const pageCount = doc.getCurrentPageInfo().pageNumber;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(
    `Page ${pageCount}`,
    pageWidth - margin,
    doc.internal.pageSize.height - margin,
    { align: 'right' }
  );
};

