import { useStudents } from "@/hooks/use-students";
import { useAttendance, useMarkAttendance } from "@/hooks/use-academics";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { format } from "date-fns";
import { Check, X, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Attendance() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedClass, setSelectedClass] = useState("P.1");
  
  const { data: students = [] } = useStudents();
  const { data: attendance = [] } = useAttendance();
  const markAttendance = useMarkAttendance();

  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
  const classStudents = students.filter(s => s.gradeId === selectedClass);

  const getStatus = (studentId: number) => {
    return attendance.find(a => a.studentId === studentId && a.date === formattedDate)?.status;
  };

  const handleMark = (studentId: number, status: string) => {
    markAttendance.mutate({
      studentId,
      date: formattedDate,
      status
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-slate-900">Daily Attendance</h2>
        <p className="text-slate-500 mt-2">Track student presence.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar: Calendar & Class Select */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border-0"
              />
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
               <label className="text-sm font-medium text-slate-700 mb-2 block">Select Class</label>
               <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baby Class">Baby Class</SelectItem>
                  <SelectItem value="P.1">P.1</SelectItem>
                  <SelectItem value="P.2">P.2</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Main: Student List */}
        <div className="md:col-span-2">
          <Card className="border-slate-200 shadow-sm min-h-[500px]">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">{format(date || new Date(), "EEEE, MMMM do, yyyy")}</h3>
                <span className="text-sm text-slate-500">{classStudents.length} Students</span>
              </div>

              {classStudents.map((student) => {
                const status = getStatus(student.id);
                return (
                  <div key={student.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        {student.photo && <AvatarImage src={student.photo} />}
                        <AvatarFallback>{student.firstName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-slate-900">{student.firstName} {student.lastName}</p>
                        <p className="text-xs text-slate-500">{student.admissionNo}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant={status === 'present' ? "default" : "outline"}
                        className={`h-9 w-9 p-0 rounded-full ${status === 'present' ? 'bg-green-500 hover:bg-green-600 border-transparent' : 'text-slate-400'}`}
                        onClick={() => handleMark(student.id, 'present')}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant={status === 'absent' ? "destructive" : "outline"}
                        className={`h-9 w-9 p-0 rounded-full ${status === 'absent' ? '' : 'text-slate-400'}`}
                         onClick={() => handleMark(student.id, 'absent')}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant={status === 'late' ? "default" : "outline"}
                        className={`h-9 w-9 p-0 rounded-full ${status === 'late' ? 'bg-orange-500 hover:bg-orange-600 border-transparent' : 'text-slate-400'}`}
                         onClick={() => handleMark(student.id, 'late')}
                      >
                        <Clock className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}

               {classStudents.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  Select a class with students to take attendance.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
