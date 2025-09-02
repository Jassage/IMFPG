import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentArgsObjectSchema } from './StudentArgs.schema';
import { FacultyArgsObjectSchema } from './FacultyArgs.schema';
import { AcademicYearArgsObjectSchema } from './AcademicYearArgs.schema'

export const EnrollmentIncludeObjectSchema: z.ZodType<Prisma.EnrollmentInclude, z.ZodTypeDef, Prisma.EnrollmentInclude> = z.object({
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional(),
  faculty: z.union([z.boolean(), z.lazy(() => FacultyArgsObjectSchema)]).optional(),
  academicYear: z.union([z.boolean(), z.lazy(() => AcademicYearArgsObjectSchema)]).optional()
}).strict();
export const EnrollmentIncludeObjectZodSchema = z.object({
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional(),
  faculty: z.union([z.boolean(), z.lazy(() => FacultyArgsObjectSchema)]).optional(),
  academicYear: z.union([z.boolean(), z.lazy(() => AcademicYearArgsObjectSchema)]).optional()
}).strict();
