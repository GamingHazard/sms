import { useFees, usePayments, useCreatePayment } from "@/hooks/use-fees";
import { useStudents } from "@/hooks/use-students";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Plus, Wallet, Printer } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPaymentSchema, type InsertPayment } from "@shared/routes";
import { useState } from "react";
import { z } from "zod";

export default function Fees() {
  const { data: students = [] } = useStudents();

  // Helper to get student name
  const getStudentName = (id: any) => {
    const s = students.find((s) => s.id === id);
    return s ? `${s.firstName} ${s.lastName}` : `Student #${id}`;
  };

  // Mock data for students with fees balances
  const mockBalances = [
    { id: 1, name: "John Doe", class: "P 1", balance: 500000 },
    { id: 2, name: "Jane Smith", class: "P 2", balance: 300000 },
    {
      id: 3,
      name: "Alice Johnson",
      class: "P 3",
      balance: 200000,
    },
    { id: 4, name: "Bob Brown", class: "P 4", balance: 150000 },
    {
      id: 5,
      name: "Charlie Davis",
      class: "P 5",
      balance: 400000,
    },
    {
      id: 6,
      name: "Charlie Davis",
      class: "P 5",
      balance: 400000,
    },
    {
      id: 7,
      name: "Charlie Davis",
      class: "P 5",
      balance: 400000,
    },
    {
      id: 8,
      name: "Charlie Davis",
      class: "P 5",
      balance: 400000,
    },
  ];

  // Mock data for fee structure (5 grades for Term 3 2024)
  const Fees = [
    {
      id: 1,
      description: "Tuition Fee",
      levelId: "primary",
      gradeId: "1",
      amount: 500000,
      term: "Term 3 ",
    },
    {
      id: 2,
      description: "Tuition Fee",
      levelId: "primary",
      gradeId: "2",
      amount: 550000,
      term: "Term 3 ",
    },
    {
      id: 3,
      description: "Tuition Fee",
      levelId: "primary",
      gradeId: "3",
      amount: 600000,
      term: "Term 3 ",
    },
    {
      id: 4,
      description: "Tuition Fee",
      levelId: "primary",
      gradeId: "4",
      amount: 650000,
      term: "Term 3 ",
    },
    {
      id: 5,
      description: "Tuition Fee",
      levelId: "primary",
      gradeId: "5",
      amount: 700000,
      term: "Term 3 ",
    },
  ];

  // Mock data for recent payments
  const mockPayments = [
    {
      id: 1,
      studentId: 1,
      date: "2024-10-01",
      reference: "REF001",
      method: "Cash",
      amount: 500000,
    },
    {
      id: 2,
      studentId: 2,
      date: "2024-10-02",
      reference: "REF002",
      method: "Bank Deposit",
      amount: 300000,
    },
    {
      id: 3,
      studentId: 3,
      date: "2024-10-03",
      reference: "REF003",
      method: "Mobile Money",
      amount: 200000,
    },
    {
      id: 4,
      studentId: 4,
      date: "2024-10-04",
      reference: "REF004",
      method: "Cash",
      amount: 150000,
    },
    {
      id: 5,
      studentId: 5,
      date: "2024-10-05",
      reference: "REF005",
      method: "Bank Deposit",
      amount: 400000,
    },
    {
      id: 6,
      studentId: 1,
      date: "2024-10-06",
      reference: "REF006",
      method: "Mobile Money",
      amount: 250000,
    },
    {
      id: 7,
      studentId: 2,
      date: "2024-10-07",
      reference: "REF007",
      method: "Cash",
      amount: 350000,
    },
    {
      id: 8,
      studentId: 3,
      date: "2024-10-08",
      reference: "REF008",
      method: "Bank Deposit",
      amount: 450000,
    },
    {
      id: 9,
      studentId: 4,
      date: "2024-10-09",
      reference: "REF009",
      method: "Mobile Money",
      amount: 100000,
    },
    {
      id: 10,
      studentId: 5,
      date: "2024-10-10",
      reference: "REF010",
      method: "Cash",
      amount: 500000,
    },
  ];

  // Use mock data instead of hook for payments
  const payments = mockPayments;

  const [searchTerm, setSearchTerm] = useState("");

  // Filter payments based on search term
  const filteredPayments = payments.filter(
    (p) =>
      getStudentName(p.studentId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) || p.date.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-slate-900">
          Fees & Finance
        </h2>
        <p className="text-slate-500 mt-2">
          Track payments, invoices, and outstanding balances.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-3 space-y-6">
          <div>
            <h3 className="text-xl font-bold font-display">Fees & Finance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <Card className="bg-gradient-to-br from-primary to-blue-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <p className="text-blue-100 font-medium mb-1">
                    Total Collections (Term 3)
                  </p>
                  <h3 className="text-3xl text-green-500 font-display font-bold">
                    UGX 12.5M
                  </h3>
                  <div className="mt-4 flex gap-2">
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">
                      +12% vs last term
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 rounded-lg shadow-md">
                <CardContent className="p-6 bg-red-200 ">
                  <p className="text-red-500 font-medium mb-1">
                    Outstanding Balance
                  </p>
                  <h3 className="text-3xl font-display font-bold text-red-600">
                    UGX 4.2M
                  </h3>
                  <div className="mt-4 flex gap-2">
                    <Badge
                      variant="outline"
                      className="text-orange-600 border-orange-200 bg-orange-50"
                    >
                      {mockBalances.length} Students
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <h3 className="text-xl font-bold font-display">Recent Payments</h3>
          <div className="mt-4 mb-4">
            <Input
              placeholder="Search by student name or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <span className="flex justify-end mb-2">
            <RecordPaymentDialog students={students} />
          </span>
          <div className="max-h-[550px] overflow-y-auto overflow-hidden rounded-lg shadow-md">
            <Card className="border-slate-200  shadow-sm overflow-hidden">
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
                  {filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-24 text-center text-slate-500"
                      >
                        No payments found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">
                          {getStudentName(p.studentId)}
                        </TableCell>
                        <TableCell className="text-slate-500">
                          {p.date}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-slate-500">
                          {p.reference || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-normal">
                            {p.method}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {p.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-primary"
                          >
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
        </div>

        <div className="col-span-1 space-y-6">
          <h3 className="text-xl font-bold font-display">
            Students with Fees Balances
          </h3>
          <div className=" shadow-md  max-h-[400px] overflow-y-auto  rounded-lg">
            <Card className="border-slate-200 shadow-sm mt-4">
              <Table className="">
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBalances.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="h-24 text-center text-slate-500"
                      >
                        No outstanding balances.
                      </TableCell>
                    </TableRow>
                  ) : (
                    mockBalances.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.name}
                        </TableCell>
                        <TableCell className="text-slate-500">
                          {student.class}
                        </TableCell>
                        <TableCell className="text-right font-medium text-red-600">
                          {student.balance.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>

          <h3 className="text-xl font-bold font-display">Fee Structure</h3>
          <div className="shadow-md  max-h-[400px] overflow-y-auto  rounded-lg">
            <Card className="border-slate-200 shadow-sm">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead className="text-sm">Tuition</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Fees.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="h-24 text-center text-slate-500"
                      >
                        No fee structures set.
                      </TableCell>
                    </TableRow>
                  ) : (
                    Fees.map((fee: any) => (
                      <TableRow key={fee.id}>
                        <TableCell className="font-medium">
                          {/* {fee.levelId === "kg" ? "Kindergarten" : "Primary"} • */}
                          P {fee.gradeId}
                        </TableCell>
                        <TableCell className="text-slate-500">
                          {fee.term}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {fee.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
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
      date: new Date().toISOString().split("T")[0],
      term: "Term 3 2024",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createPayment.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary border-0 hover:bg-primary/90 text-white">
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
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    defaultValue={field.value?.toString()}
                  >
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
            <Button
              type="submit"
              className="w-full"
              disabled={createPayment.isPending}
            >
              {createPayment.isPending ? "Recording..." : "Save Payment"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
