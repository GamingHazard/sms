import { useStudents } from "@/hooks/use-students";
import { useMarks, useRecordMark } from "@/hooks/use-academics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMarkSchema, type InsertMark } from "@shared/routes";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Save } from "lucide-react";
import { z } from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Academics() {
  const { data: students = [] } = useStudents();
  const { data: marks = [], isLoading } = useMarks();
  const recordMark = useRecordMark();
  const { toast } = useToast();

  const [selectedClass, setSelectedClass] = useState("P.1");
  const [selectedSubject, setSelectedSubject] = useState("Math");
  
  // Filter students by class
  const classStudents = students.filter(s => s.gradeId === selectedClass);
  const isKg = selectedClass.includes("Class") || selectedClass.includes("KG");

  const handleMarkUpdate = (studentId: number, value: string | number) => {
    const payload: any = {
      studentId,
      examId: 1, // Mock current exam ID
      subjectId: selectedSubject,
    };

    if (isKg) {
      payload.remark = String(value);
    } else {
      payload.score = Number(value);
    }
    
    // In a real app, debounce this or use a save button per row
    // For this demo, we'll simulate a save on blur/change
    recordMark.mutate(payload, {
      onSuccess: () => {
         // Silent success or subtle toast
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to save mark", variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-slate-900">Academics & Reports</h2>
        <p className="text-slate-500 mt-2">Manage exams, marks, and student performance.</p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
             <div className="flex gap-4 w-full md:w-auto">
               <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baby Class">Baby Class</SelectItem>
                  <SelectItem value="Top Class">Top Class</SelectItem>
                  <SelectItem value="P.1">P.1</SelectItem>
                  <SelectItem value="P.2">P.2</SelectItem>
                  <SelectItem value="P.3">P.3</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Math">Mathematics</SelectItem>
                  <SelectItem value="Eng">English</SelectItem>
                  <SelectItem value="Sci">Science</SelectItem>
                  <SelectItem value="SST">Social Studies</SelectItem>
                  <SelectItem value="Reading">Reading</SelectItem>
                </SelectContent>
              </Select>
             </div>
             <Button variant="outline" className="text-slate-600">
               <Save className="w-4 h-4 mr-2" />
               Download Report Sheet
             </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Adm No</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>
                  {isKg ? "Teacher's Remark / Observation" : "Score (100%)"}
                </TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                    No students found in {selectedClass}.
                  </TableCell>
                </TableRow>
              ) : (
                classStudents.map((student) => {
                  const mark = marks.find(m => m.studentId === student.id && m.subjectId === selectedSubject);
                  
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-mono text-xs">{student.admissionNo}</TableCell>
                      <TableCell className="font-medium">{student.firstName} {student.lastName}</TableCell>
                      <TableCell>
                         {isKg ? (
                           <Input 
                             className="max-w-md"
                             placeholder="Enter remark..."
                             defaultValue={mark?.remark || ""}
                             onBlur={(e) => handleMarkUpdate(student.id, e.target.value)}
                           />
                         ) : (
                           <Input 
                             type="number" 
                             className="w-24" 
                             max={100}
                             defaultValue={mark?.score || ""}
                             onBlur={(e) => handleMarkUpdate(student.id, e.target.value)}
                           />
                         )}
                      </TableCell>
                      <TableCell className="text-right">
                        {/* Placeholder for status indicator */}
                        {recordMark.isPending && <Loader2 className="w-4 h-4 animate-spin inline text-slate-300" />}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
