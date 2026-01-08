import { 
  users, User, InsertUser,
  students, Student, InsertStudent,
  parents, Parent, InsertParent,
  fees, Fee, InsertFee,
  payments, Payment, InsertPayment,
  attendance, Attendance, InsertAttendance,
  exams, Exam, InsertExam,
  marks, Mark, InsertMark,
  notices, Notice, InsertNotice
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Students
  getStudents(): Promise<Student[]>;
  getStudent(id: number): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: number, student: Partial<InsertStudent>): Promise<Student>;
  deleteStudent(id: number): Promise<void>;

  // Parents
  getParents(): Promise<Parent[]>;
  createParent(parent: InsertParent): Promise<Parent>;

  // Fees
  getFees(): Promise<Fee[]>;
  createFee(fee: InsertFee): Promise<Fee>;

  // Payments
  getPayments(): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;

  // Attendance
  getAttendance(): Promise<Attendance[]>;
  markAttendance(attendance: InsertAttendance): Promise<Attendance>;

  // Exams
  getExams(): Promise<Exam[]>;

  // Marks
  getMarks(): Promise<Mark[]>;
  recordMark(mark: InsertMark): Promise<Mark>;

  // Notices
  getNotices(): Promise<Notice[]>;
  createNotice(notice: InsertNotice): Promise<Notice>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private students: Map<number, Student>;
  private parents: Map<number, Parent>;
  private fees: Map<number, Fee>;
  private payments: Map<number, Payment>;
  private attendance: Map<number, Attendance>;
  private exams: Map<number, Exam>;
  private marks: Map<number, Mark>;
  private notices: Map<number, Notice>;

  private userId: number = 1;
  private studentId: number = 1;
  private parentId: number = 1;
  private feeId: number = 1;
  private paymentId: number = 1;
  private attendanceId: number = 1;
  private examId: number = 1;
  private markId: number = 1;
  private noticeId: number = 1;

  constructor() {
    this.users = new Map();
    this.students = new Map();
    this.parents = new Map();
    this.fees = new Map();
    this.payments = new Map();
    this.attendance = new Map();
    this.exams = new Map();
    this.marks = new Map();
    this.notices = new Map();

    this.seedMockData();
  }

  private seedMockData() {
    // Seed Students
    this.createStudent({
      admissionNo: "ADM001",
      firstName: "Aisha",
      lastName: "Kato",
      levelId: "kg",
      gradeId: "baby",
      streamId: null,
      dob: "2020-05-12",
      gender: "F",
      status: "active",
      photo: "https://placehold.co/400",
      parentContact: "+256712345678"
    });

    this.createStudent({
      admissionNo: "ADM002",
      firstName: "James",
      lastName: "Okello",
      levelId: "primary",
      gradeId: "p2",
      streamId: "Blue",
      dob: "2016-11-30",
      gender: "M",
      status: "active",
      photo: "https://placehold.co/400",
      parentContact: "+256712345678"
    });

    // Seed Parents
    this.createParent({
      firstName: "Grace",
      lastName: "Kato",
      phone: "+256712345678",
      email: "grace@example.com",
      students: ["ADM001"]
    });

    // Seed Fees
    this.createFee({
      levelId: "primary",
      gradeId: "p1",
      term: "1",
      amount: 200000,
      description: "Tuition Fee Term 1"
    });

    // Seed Payments
    this.createPayment({
      studentId: 2, // James
      amount: 100000,
      method: "Mobile Money",
      reference: "MM123",
      date: "2026-01-06",
      term: "1"
    });

    // Seed Attendance
    this.markAttendance({
      studentId: 1, // Aisha
      date: "2026-01-07",
      status: "present"
    });
    this.markAttendance({
      studentId: 2, // James
      date: "2026-01-07",
      status: "absent"
    });

    // Seed Exams
    const exam = {
      id: this.examId++,
      name: "Mid-Term 2026",
      term: "Mid",
      year: 2026,
      levelId: "primary"
    };
    this.exams.set(exam.id, exam);

    // Seed Marks
    this.recordMark({
      studentId: 2, // James
      examId: exam.id,
      subjectId: "English",
      score: 78
    });

    // Seed Notices
    this.createNotice({
      title: "Welcome Back!",
      content: "School reopens on Feb 2nd. Please clear all fees.",
      audience: "All",
      date: "2026-01-08"
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id: id.toString() }; // Schema uses string ID for users usually, but here number. Let's adjust if schema is string.
    // Schema default: varchar("id").primaryKey().default(sql`gen_random_uuid()`) -> String.
    // But I'm mocking. Let's just use string "1", "2".
    this.users.set(id, user);
    return user;
  }

  // Students
  async getStudents(): Promise<Student[]> {
    return Array.from(this.students.values());
  }
  async getStudent(id: number): Promise<Student | undefined> {
    return this.students.get(id);
  }
  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const id = this.studentId++;
    const student = { ...insertStudent, id };
    this.students.set(id, student);
    return student;
  }
  async updateStudent(id: number, updates: Partial<InsertStudent>): Promise<Student> {
    const existing = this.students.get(id);
    if (!existing) throw new Error("Student not found");
    const updated = { ...existing, ...updates };
    this.students.set(id, updated);
    return updated;
  }
  async deleteStudent(id: number): Promise<void> {
    this.students.delete(id);
  }

  // Parents
  async getParents(): Promise<Parent[]> {
    return Array.from(this.parents.values());
  }
  async createParent(insertParent: InsertParent): Promise<Parent> {
    const id = this.parentId++;
    const parent = { ...insertParent, id };
    this.parents.set(id, parent);
    return parent;
  }

  // Fees
  async getFees(): Promise<Fee[]> {
    return Array.from(this.fees.values());
  }
  async createFee(insertFee: InsertFee): Promise<Fee> {
    const id = this.feeId++;
    const fee = { ...insertFee, id };
    this.fees.set(id, fee);
    return fee;
  }

  // Payments
  async getPayments(): Promise<Payment[]> {
    return Array.from(this.payments.values());
  }
  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = this.paymentId++;
    const payment = { ...insertPayment, id };
    this.payments.set(id, payment);
    return payment;
  }

  // Attendance
  async getAttendance(): Promise<Attendance[]> {
    return Array.from(this.attendance.values());
  }
  async markAttendance(insertAttendance: InsertAttendance): Promise<Attendance> {
    const id = this.attendanceId++;
    const attendance = { ...insertAttendance, id };
    this.attendance.set(id, attendance);
    return attendance;
  }

  // Exams
  async getExams(): Promise<Exam[]> {
    return Array.from(this.exams.values());
  }

  // Marks
  async getMarks(): Promise<Mark[]> {
    return Array.from(this.marks.values());
  }
  async recordMark(insertMark: InsertMark): Promise<Mark> {
    const id = this.markId++;
    const mark = { ...insertMark, id };
    this.marks.set(id, mark);
    return mark;
  }

  // Notices
  async getNotices(): Promise<Notice[]> {
    return Array.from(this.notices.values());
  }
  async createNotice(insertNotice: InsertNotice): Promise<Notice> {
    const id = this.noticeId++;
    const notice = { ...insertNotice, id };
    this.notices.set(id, notice);
    return notice;
  }
}

export const storage = new MemStorage();
