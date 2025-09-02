import { z } from 'zod';
export const EnrollmentGroupByResultSchema = z.array(z.object({
  id: z.string(),
  studentId: z.string(),
  facultyId: z.string(),
  level: z.string(),
  academicYearId: z.string(),
  enrollmentDate: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    student: z.number(),
    studentId: z.number(),
    faculty: z.number(),
    facultyId: z.number(),
    level: z.number(),
    academicYearId: z.number(),
    academicYear: z.number(),
    enrollmentDate: z.number(),
    status: z.number(),
    createdAt: z.number(),
    updatedAt: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    studentId: z.string().nullable(),
    facultyId: z.string().nullable(),
    level: z.string().nullable(),
    academicYearId: z.string().nullable(),
    enrollmentDate: z.date().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    studentId: z.string().nullable(),
    facultyId: z.string().nullable(),
    level: z.string().nullable(),
    academicYearId: z.string().nullable(),
    enrollmentDate: z.date().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));