import { useStudent } from "@/hooks/use-students";
import { useRoute } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "wouter";

export default function StudentProfile() {
  const [, params] = useRoute("/students/:id");
  const id = Number(params?.id);
  const { data: student, isLoading } = useStudent(id);

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!student) return <div className="p-12 text-center text-slate-500">Student not found</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/students">
          <Button variant="ghost" size="icon" className="text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900">Student Profile</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-md text-center overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary to-blue-600"></div>
            <div className="relative -mt-12 px-6 pb-6">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg mx-auto">
                <AvatarImage src={student.photo || ""} />
                <AvatarFallback className="text-2xl">{student.firstName[0]}</AvatarFallback>
              </Avatar>
              <h3 className="mt-3 text-xl font-bold text-slate-900">{student.firstName} {student.lastName}</h3>
              <p className="text-slate-500 text-sm font-mono">{student.admissionNo}</p>
              
              <div className="mt-4 flex justify-center gap-2">
                 <Badge variant="secondary">{student.levelId === 'kg' ? 'Kindergarten' : 'Primary'}</Badge>
                 <Badge variant="outline">{student.gradeId}</Badge>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 text-left">
                <div>
                   <span className="text-xs text-slate-400 block uppercase tracking-wider">DOB</span>
                   <span className="text-sm font-medium text-slate-900">{student.dob}</span>
                </div>
                 <div>
                   <span className="text-xs text-slate-400 block uppercase tracking-wider">Gender</span>
                   <span className="text-sm font-medium text-slate-900">{student.gender === 'M' ? 'Male' : 'Female'}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs Content */}
        <div className="md:col-span-3">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start border-b border-slate-200 rounded-none bg-transparent p-0 mb-6">
              <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-6 py-3">Overview</TabsTrigger>
              <TabsTrigger value="fees" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-6 py-3">Fees & Payments</TabsTrigger>
              <TabsTrigger value="academic" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-6 py-3">Academic Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Parent / Guardian Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Emergency Contact</p>
                      <p className="text-slate-600">{student.parentContact || "No contact provided"}</p>
                    </div>
                  </div>
                   <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Address</p>
                      <p className="text-slate-600">Kampala, Uganda</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Medical Notes</CardTitle>
                </CardHeader>
                <CardContent>
                   <p className="text-slate-600">{student.medicalNotes || "No medical notes recorded."}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fees">
               <Card className="border-slate-200 shadow-sm">
                 <CardContent className="p-8 text-center">
                   <p className="text-slate-500">Fees history will appear here.</p>
                 </CardContent>
               </Card>
            </TabsContent>

             <TabsContent value="academic">
               <Card className="border-slate-200 shadow-sm">
                 <CardContent className="p-8 text-center">
                   <p className="text-slate-500">Exam results and marks will appear here.</p>
                 </CardContent>
               </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
