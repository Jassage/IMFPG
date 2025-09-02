import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentStatusSchema } from '../enums/EnrollmentStatus.schema';
import { FacultyCreateNestedOneWithoutEnrollmentsInputObjectSchema } from './FacultyCreateNestedOneWithoutEnrollmentsInput.schema';
import { AcademicYearCreateNestedOneWithoutEnrollmentsInputObjectSchema } from './AcademicYearCreateNestedOneWithoutEnrollmentsInput.schema'

export const EnrollmentCreateWithoutStudentInputObjectSchema: z.ZodType<Prisma.EnrollmentCreateWithoutStudentInput, z.ZodTypeDef, Prisma.EnrollmentCreateWithoutStudentInput> = z.object({
  id: z.string().optional(),
  level: z.string(),
  enrollmentDate: z.date(),
  status: EnrollmentStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  faculty: z.lazy(() => FacultyCreateNestedOneWithoutEnrollmentsInputObjectSchema),
  academicYear: z.lazy(() => AcademicYearCreateNestedOneWithoutEnrollmentsInputObjectSchema).optional()
}).strict();
export const EnrollmentCreateWithoutStudentInputObjectZodSchema = z.object({
  id: z.string().optional(),
  level: z.string(),
  enrollmentDate: z.date(),
  status: EnrollmentStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  faculty: z.lazy(() => FacultyCreateNestedOneWithoutEnrollmentsInputObjectSchema),
  academicYear: z.lazy(() => AcademicYearCreateNestedOneWithoutEnrollmentsInputObjectSchema).optional()
}).strict();
