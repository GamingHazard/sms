import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Students
  app.get(api.students.list.path, async (req, res) => {
    const students = await storage.getStudents();
    res.json(students);
  });

  app.post(api.students.create.path, async (req, res) => {
    try {
      const input = api.students.create.input.parse(req.body);
      const student = await storage.createStudent(input);
      res.status(201).json(student);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.get(api.students.get.path, async (req, res) => {
    const student = await storage.getStudent(Number(req.params.id));
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  });

  app.patch(api.students.update.path, async (req, res) => {
    try {
      const input = api.students.update.input.parse(req.body);
      const student = await storage.updateStudent(Number(req.params.id), input);
      res.json(student);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(404).json({ message: "Student not found" });
      }
    }
  });

  app.delete(api.students.delete.path, async (req, res) => {
    await storage.deleteStudent(Number(req.params.id));
    res.status(204).send();
  });

  // Parents
  app.get(api.parents.list.path, async (req, res) => {
    const parents = await storage.getParents();
    res.json(parents);
  });

  app.post(api.parents.create.path, async (req, res) => {
    const input = api.parents.create.input.parse(req.body);
    const parent = await storage.createParent(input);
    res.status(201).json(parent);
  });

  // Fees
  app.get(api.fees.list.path, async (req, res) => {
    const fees = await storage.getFees();
    res.json(fees);
  });

  app.post(api.fees.create.path, async (req, res) => {
    const input = api.fees.create.input.parse(req.body);
    const fee = await storage.createFee(input);
    res.status(201).json(fee);
  });

  // Payments
  app.get(api.payments.list.path, async (req, res) => {
    const payments = await storage.getPayments();
    res.json(payments);
  });

  app.post(api.payments.create.path, async (req, res) => {
    const input = api.payments.create.input.parse(req.body);
    const payment = await storage.createPayment(input);
    res.status(201).json(payment);
  });

  // Attendance
  app.get(api.attendance.list.path, async (req, res) => {
    const attendance = await storage.getAttendance();
    res.json(attendance);
  });

  app.post(api.attendance.mark.path, async (req, res) => {
    const input = api.attendance.mark.input.parse(req.body);
    const attendance = await storage.markAttendance(input);
    res.status(201).json(attendance);
  });

  // Exams
  app.get(api.exams.list.path, async (req, res) => {
    const exams = await storage.getExams();
    res.json(exams);
  });

  // Marks
  app.get(api.marks.list.path, async (req, res) => {
    const marks = await storage.getMarks();
    res.json(marks);
  });

  app.post(api.marks.record.path, async (req, res) => {
    const input = api.marks.record.input.parse(req.body);
    const mark = await storage.recordMark(input);
    res.status(201).json(mark);
  });

  // Notices
  app.get(api.notices.list.path, async (req, res) => {
    const notices = await storage.getNotices();
    res.json(notices);
  });

  app.post(api.notices.create.path, async (req, res) => {
    const input = api.notices.create.input.parse(req.body);
    const notice = await storage.createNotice(input);
    res.status(201).json(notice);
  });

  return httpServer;
}
