import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentStatusSchema } from '../enums/EnrollmentStatus.schema';
import { StudentCreateNestedOneWithoutEnrollmentsInputObjectSchema } from './StudentCreateNestedOneWithoutEnrollmentsInput.schema';
import { FacultyCreateNestedOneWithoutEnrollmentsInputObjectSchema } from './FacultyCreateNestedOneWithoutEnrollmentsInput.schema'

export const EnrollmentCreateWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.EnrollmentCreateWithoutAcademicYearInput, z.ZodTypeDef, Prisma.EnrollmentCreateWithoutAcademicYearInput> = z.object({
  id: z.string().optional(),
  level: z.string(),
  enrollmentDate: z.date(),
  status: EnrollmentStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  student: z.lazy(() => StudentCreateNestedOneWithoutEnrollmentsInputObjectSchema),
  faculty: z.lazy(() => FacultyCreateNestedOneWithoutEnrollmentsInputObjectSchema)
}).strict();
export const EnrollmentCreateWithoutAcademicYearInputObjectZodSchema = z.object({
  id: z.string().optional(),
  level: z.string(),
  enrollmentDate: z.date(),
  status: EnrollmentStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  student: z.lazy(() => StudentCreateNestedOneWithoutEnrollmentsInputObjectSchema),
  faculty: z.lazy(() => FacultyCreateNestedOneWithoutEnrollmentsInputObjectSchema)
}).strict();
