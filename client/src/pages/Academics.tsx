import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStudents } from "@/hooks/use-students";
import { useMarks, useCreateMark } from "@/hooks/use-academics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import AcademicYears from "./AcademicYears";
import Terms from "./Terms";

export default function Academics() {
  const { data: students = [] } = useStudents();
  const { data: marks = [] } = useMarks();
  const createMark = useCreateMark();
  const { toast } = useToast();

  const [selectedClass, setSelectedClass] = useState("P.1");
  const [selectedSubject, setSelectedSubject] = useState("Math");

  // Filter students by class
  const classStudents = students.filter((s) => s.grade_id === selectedClass);
  const isKg = selectedClass.includes("Class") || selectedClass.includes("KG");

  const handleMarkUpdate = (studentId: string, value: string | number) => {
    const payload: any = {
      student_id: studentId,
      exam_id: "ex2026mid", // Mock current exam ID
      subject_id: selectedSubject,
    };

    if (isKg) {
      payload.remark = String(value);
    } else {
      payload.score = Number(value);
    }

    createMark.mutate(payload, {
      onSuccess: () => {
        // Silent success
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to save mark",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Academics Setup</h1>
      <Tabs defaultValue="years" className="w-full">
        <TabsList>
          <TabsTrigger value="years">Academic Years</TabsTrigger>
          <TabsTrigger value="terms">Terms</TabsTrigger>
          <TabsTrigger value="marks">Marks Entry</TabsTrigger>
        </TabsList>
        <TabsContent value="years">
          <AcademicYears />
        </TabsContent>
        <TabsContent value="terms">
          <Terms />
        </TabsContent>
        <TabsContent value="marks">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-slate-900">
                Marks Entry
              </h2>
              <p className="text-slate-500 mt-2">
                Manage exams, marks, and student performance.
              </p>
            </div>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                  <div className="flex gap-4 w-full md:w-auto">
                    <Select
                      value={selectedClass}
                      onValueChange={setSelectedClass}
                    >
                      <SelectTrigger className="w-[180px] bg-white">
                        <SelectValue placeholder="Select Class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baby">Baby Class</SelectItem>
                        <SelectItem value="top">Top Class</SelectItem>
                        <SelectItem value="p1">P.1</SelectItem>
                        <SelectItem value="p2">P.2</SelectItem>
                        <SelectItem value="p3">P.3</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedSubject}
                      onValueChange={setSelectedSubject}
                    >
                      <SelectTrigger className="w-[180px] bg-white">
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sub01">English</SelectItem>
                        <SelectItem value="sub02">Mathematics</SelectItem>
                        <SelectItem value="sub03">Phonics</SelectItem>
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
                        {isKg
                          ? "Teacher's Remark / Observation"
                          : "Score (100%)"}
                      </TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classStudents.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="h-32 text-center text-slate-500"
                        >
                          No students found in {selectedClass}.
                        </TableCell>
                      </TableRow>
                    ) : (
                      classStudents.map((student: any) => {
                        const mark = marks.find(
                          (m) =>
                            m.student_id === student.id &&
                            m.subject_id === selectedSubject
                        );

                        return (
                          <TableRow key={student.id}>
                            <TableCell className="font-mono text-xs">
                              {student.admission_no}
                            </TableCell>
                            <TableCell className="font-medium">
                              {student.first_name} {student.last_name}
                            </TableCell>
                            <TableCell>
                              {isKg ? (
                                <Input
                                  className="max-w-md"
                                  placeholder="Enter remark..."
                                  defaultValue={mark?.remark || ""}
                                  onBlur={(e) =>
                                    handleMarkUpdate(student.id, e.target.value)
                                  }
                                />
                              ) : (
                                <Input
                                  type="number"
                                  className="w-24"
                                  max={100}
                                  defaultValue={mark?.score || ""}
                                  onBlur={(e) =>
                                    handleMarkUpdate(student.id, e.target.value)
                                  }
                                />
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {createMark.isPending && (
                                <Loader2 className="w-4 h-4 animate-spin inline text-slate-300" />
                              )}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
