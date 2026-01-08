import { useStudents } from "@/hooks/use-students";
import { useFees } from "@/hooks/use-fees";
import { useNotices, useCreateNotice } from "@/hooks/use-notices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Wallet, 
  GraduationCap, 
  TrendingUp, 
  Plus, 
  Clock,
  Calendar
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { useRole } from "@/hooks/use-role";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertNoticeSchema, type InsertNotice } from "@shared/routes";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const chartData = [
  { name: 'KG 1', students: 40 },
  { name: 'KG 2', students: 35 },
  { name: 'KG 3', students: 45 },
  { name: 'P.1', students: 50 },
  { name: 'P.2', students: 48 },
  { name: 'P.3', students: 52 },
];

export default function Dashboard() {
  const { data: students = [] } = useStudents();
  const { data: fees = [] } = useFees(); // Using fees endpoint for metrics roughly
  const { data: notices = [] } = useNotices();
  const { role, canEdit } = useRole();

  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  
  // Mock finance data since payment endpoint is simple
  const totalCollections = 12500000; 
  const outstandingFees = 4200000;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-slate-900">Welcome Back, {role === 'admin' ? 'Administrator' : 'Teacher'}</h2>
        <p className="text-slate-500 mt-2">Here's what's happening at your school today.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Students" 
          value={totalStudents} 
          subtitle={`${activeStudents} Active Now`} 
          icon={Users} 
          trend="+12% vs last term"
          color="bg-blue-500"
        />
        <MetricCard 
          title="Collections" 
          value={`UGX ${(totalCollections / 1000000).toFixed(1)}M`} 
          subtitle="Term 1 2024" 
          icon={Wallet} 
          trend="+5% vs last week"
          color="bg-green-500"
        />
        <MetricCard 
          title="Outstanding" 
          value={`UGX ${(outstandingFees / 1000000).toFixed(1)}M`} 
          subtitle="Pending Payments" 
          icon={TrendingUp} 
          trend="Needs attention"
          color="bg-orange-500"
          isNegative
        />
        <MetricCard 
          title="Attendance" 
          value="94%" 
          subtitle="Daily Average" 
          icon={GraduationCap} 
          trend="+2% vs yesterday"
          color="bg-purple-500"
        />
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Analytics */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-display">Student Enrollment by Class</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="shadow-sm border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-display">Recent Activity</CardTitle>
                <Clock className="w-4 h-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 items-start pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">New payment recorded</p>
                        <p className="text-xs text-slate-500">UGX 250,000 from Parent of Aisha K.</p>
                        <p className="text-[10px] text-slate-400 mt-1">2 hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

             <Card className="shadow-sm border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-display">Upcoming Events</CardTitle>
                <Calendar className="w-4 h-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3 items-center bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <div className="bg-white p-2 rounded text-center min-w-[50px]">
                      <span className="block text-xs font-bold text-blue-600 uppercase">Aug</span>
                      <span className="block text-lg font-bold text-slate-900">12</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">End of Term Exams</p>
                      <p className="text-xs text-slate-500">All Primary Classes</p>
                    </div>
                  </div>
                   <div className="flex gap-3 items-center bg-green-50 p-3 rounded-lg border border-green-100">
                    <div className="bg-white p-2 rounded text-center min-w-[50px]">
                      <span className="block text-xs font-bold text-green-600 uppercase">Aug</span>
                      <span className="block text-lg font-bold text-slate-900">24</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Parents Meeting</p>
                      <p className="text-xs text-slate-500">Main Hall, 10:00 AM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Notices */}
        <div className="space-y-6">
          <Card className="h-full shadow-sm border-slate-200 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-display">Notice Board</CardTitle>
              {canEdit && <CreateNoticeDialog />}
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto max-h-[600px] space-y-4 pr-2">
              {notices.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p>No active notices</p>
                </div>
              ) : (
                notices.map((notice) => (
                  <div key={notice.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-primary/20 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {notice.audience}
                      </span>
                      <span className="text-xs text-slate-400">{notice.date}</span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">{notice.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{notice.content}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon: Icon, trend, color, isNegative }: any) {
  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold font-display text-slate-900">{value}</h3>
          </div>
          <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-white group-hover:scale-110 transition-transform duration-300`} style={{ backgroundColor: color }}>
             <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${isNegative ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {trend}
          </span>
          <span className="text-xs text-slate-400">{subtitle}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function CreateNoticeDialog() {
  const [open, setOpen] = useState(false);
  const createNotice = useCreateNotice();
  const form = useForm<InsertNotice>({
    resolver: zodResolver(insertNoticeSchema),
    defaultValues: {
      title: "",
      content: "",
      audience: "All",
      date: new Date().toISOString().split('T')[0],
    }
  });

  const onSubmit = (data: InsertNotice) => {
    createNotice.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-full border-dashed border-slate-300 hover:border-primary hover:text-primary">
          <Plus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Post New Notice</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g. School Closure" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="audience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Audience</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Parents">Parents</SelectItem>
                      <SelectItem value="Teachers">Teachers</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Notice details..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={createNotice.isPending} className="w-full">
              {createNotice.isPending ? "Posting..." : "Post Notice"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
