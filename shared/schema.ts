import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  admissionNo: text("admission_no").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  levelId: text("level_id").notNull(), // 'kg' or 'primary'
  gradeId: text("grade_id").notNull(),
  streamId: text("stream_id"),
  dob: text("dob").notNull(),
  gender: text("gender").notNull(), // 'M' or 'F'
  status: text("status").notNull().default("active"),
  photo: text("photo").default("https://placehold.co/400"),
  parentContact: text("parent_contact"),
  emergencyContact: text("emergency_contact"),
  medicalNotes: text("medical_notes"),
});

export const parents = pgTable("parents", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  students: jsonb("students").$type<string[]>(), // Array of student IDs (strings/admission nos for mock)
});

export const fees = pgTable("fees", {
  id: serial("id").primaryKey(),
  levelId: text("level_id").notNull(),
  gradeId: text("grade_id"), // Optional, if specific to grade
  term: text("term").notNull(),
  amount: integer("amount").notNull(),
  description: text("description"),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  amount: integer("amount").notNull(),
  method: text("method").notNull(), // 'Cash', 'Bank', 'Mobile Money'
  reference: text("reference"),
  date: text("date").notNull(),
  term: text("term").notNull(),
});

export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  date: text("date").notNull(),
  status: text("status").notNull(), // 'present', 'absent', 'late'
});

export const exams = pgTable("exams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  term: text("term").notNull(),
  year: integer("year").notNull(),
  levelId: text("level_id").notNull(),
});

export const marks = pgTable("marks", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  examId: integer("exam_id").notNull(),
  subjectId: text("subject_id").notNull(),
  score: integer("score"), // For Primary
  remark: text("remark"), // For KG
});

export const notices = pgTable("notices", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  audience: text("audience").notNull(), // 'All', 'Parents', 'Teachers'
  date: text("date").notNull(),
});

// === SCHEMAS ===

export const insertStudentSchema = createInsertSchema(students).omit({ id: true });
export const insertParentSchema = createInsertSchema(parents).omit({ id: true });
export const insertFeeSchema = createInsertSchema(fees).omit({ id: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true });
export const insertAttendanceSchema = createInsertSchema(attendance).omit({ id: true });
export const insertExamSchema = createInsertSchema(exams).omit({ id: true });
export const insertMarkSchema = createInsertSchema(marks).omit({ id: true });
export const insertNoticeSchema = createInsertSchema(notices).omit({ id: true });

// === TYPES ===

export type Student = typeof students.$inferSelect;
export type Parent = typeof parents.$inferSelect;
export type Fee = typeof fees.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Attendance = typeof attendance.$inferSelect;
export type Exam = typeof exams.$inferSelect;
export type Mark = typeof marks.$inferSelect;
export type Notice = typeof notices.$inferSelect;

export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type InsertParent = z.infer<typeof insertParentSchema>;
export type InsertFee = z.infer<typeof insertFeeSchema>;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type InsertExam = z.infer<typeof insertExamSchema>;
export type InsertMark = z.infer<typeof insertMarkSchema>;
export type InsertNotice = z.infer<typeof insertNoticeSchema>;
