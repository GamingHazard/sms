import { useFees, usePayments, useCreatePayment } from "@/hooks/use-fees";
import { useStudents } from "@/hooks/use-students";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Plus, Wallet, Printer } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPaymentSchema, type InsertPayment } from "@shared/routes";
import { useState } from "react";
import { z } from "zod";

export default function Fees() {
  const { data: payments = [] } = usePayments();
  const { data: fees = [] } = useFees();
  const { data: students = [] } = useStudents();
  
  // Helper to get student name
  const getStudentName = (id: number) => {
    const s = students.find(s => s.id === id);
    return s ? `${s.firstName} ${s.lastName}` : `Student #${id}`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-slate-900">Fees & Finance</h2>
        <p className="text-slate-500 mt-2">Track payments, invoices, and outstanding balances.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <p className="text-blue-100 font-medium mb-1">Total Collections (Term 3)</p>
            <h3 className="text-3xl font-display font-bold">UGX 12.5M</h3>
            <div className="mt-4 flex gap-2">
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">+12% vs last term</Badge>
            </div>
          </CardContent>
        </Card>
         <Card>
          <CardContent className="p-6">
            <p className="text-slate-500 font-medium mb-1">Outstanding Balance</p>
            <h3 className="text-3xl font-display font-bold text-slate-900">UGX 4.2M</h3>
             <div className="mt-4 flex gap-2">
              <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">15 Students</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-display">Recent Payments</h3>
            <RecordPaymentDialog students={students} />
          </div>

          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount (UGX)</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                      No payments recorded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{getStudentName(p.studentId)}</TableCell>
                      <TableCell className="text-slate-500">{p.date}</TableCell>
                      <TableCell className="font-mono text-xs text-slate-500">{p.reference || '-'}</TableCell>
                      <TableCell>
                         <Badge variant="secondary" className="font-normal">{p.method}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {p.amount.toLocaleString()}
                      </TableCell>
                       <TableCell>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary">
                           <Printer className="w-4 h-4" />
                         </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold font-display">Fee Structure</h3>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-0">
              {fees.length === 0 ? (
                 <div className="p-6 text-center text-slate-500 text-sm">No fee structures set.</div>
              ) : (
                fees.map((fee, i) => (
                  <div key={fee.id} className={`p-4 ${i !== fees.length - 1 ? 'border-b border-slate-100' : ''}`}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="font-bold text-slate-900">{fee.description || 'Tuition Fee'}</p>
                        <p className="text-xs text-slate-500">
                          {fee.levelId === 'kg' ? 'Kindergarten' : 'Primary'} • {fee.gradeId || 'All Grades'}
                        </p>
                      </div>
                      <p className="font-bold font-mono text-primary">{fee.amount.toLocaleString()}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] h-5 px-1.5">{fee.term}</Badge>
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

function RecordPaymentDialog({ students }: { students: any[] }) {
  const [open, setOpen] = useState(false);
  const createPayment = useCreatePayment();

  // Extend schema to handle number coercion
  const formSchema = insertPaymentSchema.extend({
    amount: z.coerce.number(),
    studentId: z.coerce.number(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: undefined,
      amount: 0,
      method: "Cash",
      reference: "",
      date: new Date().toISOString().split('T')[0],
      term: "Term 3 2024",
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createPayment.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Record Payment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record New Payment</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student</FormLabel>
                   <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[200px]">
                      {students.map((s) => (
                        <SelectItem key={s.id} value={s.id.toString()}>
                          {s.firstName} {s.lastName} ({s.admissionNo})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (UGX)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Bank Deposit">Bank Deposit</SelectItem>
                      <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference No / Receipt No</FormLabel>
                  <FormControl>
                    <Input placeholder="Optional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={createPayment.isPending}>
              {createPayment.isPending ? "Recording..." : "Save Payment"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
