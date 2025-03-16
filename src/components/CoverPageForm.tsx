
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Trash2 } from "lucide-react";

const coverPageSchema = z.object({
  studentName: z.string().min(2, "Student name is required"),
  studentId: z.string().min(2, "Student ID is required"),
  institution: z.string().min(2, "Institution name is required"),
  department: z.string().min(2, "Department name is required"),
  companyName: z.string().min(2, "Company name is required"),
  supervisorName: z.string().min(2, "Supervisor name is required"),
  startDate: z.string().min(2, "Start date is required"),
  endDate: z.string().min(2, "End date is required"),
});

export type CoverPageFormValues = z.infer<typeof coverPageSchema>;

interface CoverPageFormProps {
  onSubmit: (values: CoverPageFormValues & { 
    institutionLogo: string | null; 
    companyLogo: string | null;
  }) => void;
  onCancel: () => void;
}

const CoverPageForm = ({ onSubmit, onCancel }: CoverPageFormProps) => {
  const [institutionLogo, setInstitutionLogo] = useState<string | null>(null);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);

  const form = useForm<CoverPageFormValues>({
    resolver: zodResolver(coverPageSchema),
    defaultValues: {
      studentName: "",
      studentId: "",
      institution: "",
      department: "",
      companyName: "",
      supervisorName: "",
      startDate: "",
      endDate: "",
    },
  });

  const handleLogoUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setLogo: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogo(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (values: CoverPageFormValues) => {
    onSubmit({
      ...values,
      institutionLogo,
      companyLogo,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Student Details</h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="studentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student ID</FormLabel>
                    <FormControl>
                      <Input placeholder="STUD/2023/001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-medium mt-6 mb-4">Institution Details</h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution Name</FormLabel>
                    <FormControl>
                      <Input placeholder="University of Example" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="Computer Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Institution Logo</FormLabel>
                <div className="flex flex-col items-start gap-2">
                  {institutionLogo ? (
                    <div className="relative w-40 h-40 border rounded-md overflow-hidden">
                      <img 
                        src={institutionLogo} 
                        alt="Institution logo" 
                        className="w-full h-full object-contain"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        onClick={() => setInstitutionLogo(null)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center w-40 h-40 border border-dashed rounded-md">
                      <input
                        type="file"
                        id="institution-logo"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleLogoUpload(e, setInstitutionLogo)}
                      />
                      <label
                        htmlFor="institution-logo"
                        className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
                      >
                        <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Upload logo</span>
                      </label>
                    </div>
                  )}
                </div>
              </FormItem>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Company Details</h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Example Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="supervisorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supervisor Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Company Logo</FormLabel>
                <div className="flex flex-col items-start gap-2">
                  {companyLogo ? (
                    <div className="relative w-40 h-40 border rounded-md overflow-hidden">
                      <img 
                        src={companyLogo} 
                        alt="Company logo" 
                        className="w-full h-full object-contain"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        onClick={() => setCompanyLogo(null)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center w-40 h-40 border border-dashed rounded-md">
                      <input
                        type="file"
                        id="company-logo"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleLogoUpload(e, setCompanyLogo)}
                      />
                      <label
                        htmlFor="company-logo"
                        className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
                      >
                        <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Upload logo</span>
                      </label>
                    </div>
                  )}
                </div>
              </FormItem>
            </div>

            <h3 className="text-lg font-medium mt-6 mb-4">Internship Period</h3>
            <div className="space-y-4 grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Generate Logbook</Button>
        </div>
      </form>
    </Form>
  );
};

export default CoverPageForm;
