import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentArgsObjectSchema } from './StudentArgs.schema';
import { FacultyArgsObjectSchema } from './FacultyArgs.schema';
import { AcademicYearArgsObjectSchema } from './AcademicYearArgs.schema'

export const EnrollmentSelectObjectSchema: z.ZodType<Prisma.EnrollmentSelect, z.ZodTypeDef, Prisma.EnrollmentSelect> = z.object({
  id: z.boolean().optional(),
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional(),
  studentId: z.boolean().optional(),
  faculty: z.union([z.boolean(), z.lazy(() => FacultyArgsObjectSchema)]).optional(),
  facultyId: z.boolean().optional(),
  level: z.boolean().optional(),
  academicYearId: z.boolean().optional(),
  academicYear: z.union([z.boolean(), z.lazy(() => AcademicYearArgsObjectSchema)]).optional(),
  enrollmentDate: z.boolean().optional(),
  status: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional()
}).strict();
export const EnrollmentSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional(),
  studentId: z.boolean().optional(),
  faculty: z.union([z.boolean(), z.lazy(() => FacultyArgsObjectSchema)]).optional(),
  facultyId: z.boolean().optional(),
  level: z.boolean().optional(),
  academicYearId: z.boolean().optional(),
  academicYear: z.union([z.boolean(), z.lazy(() => AcademicYearArgsObjectSchema)]).optional(),
  enrollmentDate: z.boolean().optional(),
  status: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional()
}).strict();
