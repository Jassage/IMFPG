import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentStatusSchema } from '../enums/EnrollmentStatus.schema';
import { StudentCreateNestedOneWithoutEnrollmentsInputObjectSchema } from './StudentCreateNestedOneWithoutEnrollmentsInput.schema';
import { AcademicYearCreateNestedOneWithoutEnrollmentsInputObjectSchema } from './AcademicYearCreateNestedOneWithoutEnrollmentsInput.schema'

export const EnrollmentCreateWithoutFacultyInputObjectSchema: z.ZodType<Prisma.EnrollmentCreateWithoutFacultyInput, z.ZodTypeDef, Prisma.EnrollmentCreateWithoutFacultyInput> = z.object({
  id: z.string().optional(),
  level: z.string(),
  enrollmentDate: z.date(),
  status: EnrollmentStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  student: z.lazy(() => StudentCreateNestedOneWithoutEnrollmentsInputObjectSchema),
  academicYear: z.lazy(() => AcademicYearCreateNestedOneWithoutEnrollmentsInputObjectSchema).optional()
}).strict();
export const EnrollmentCreateWithoutFacultyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  level: z.string(),
  enrollmentDate: z.date(),
  status: EnrollmentStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  student: z.lazy(() => StudentCreateNestedOneWithoutEnrollmentsInputObjectSchema),
  academicYear: z.lazy(() => AcademicYearCreateNestedOneWithoutEnrollmentsInputObjectSchema).optional()
}).strict();
