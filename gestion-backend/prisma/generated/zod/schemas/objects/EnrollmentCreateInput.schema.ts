import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentStatusSchema } from '../enums/EnrollmentStatus.schema';
import { StudentCreateNestedOneWithoutEnrollmentsInputObjectSchema } from './StudentCreateNestedOneWithoutEnrollmentsInput.schema';
import { FacultyCreateNestedOneWithoutEnrollmentsInputObjectSchema } from './FacultyCreateNestedOneWithoutEnrollmentsInput.schema';
import { AcademicYearCreateNestedOneWithoutEnrollmentsInputObjectSchema } from './AcademicYearCreateNestedOneWithoutEnrollmentsInput.schema'

export const EnrollmentCreateInputObjectSchema: z.ZodType<Prisma.EnrollmentCreateInput, z.ZodTypeDef, Prisma.EnrollmentCreateInput> = z.object({
  id: z.string().optional(),
  level: z.string(),
  enrollmentDate: z.date(),
  status: EnrollmentStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  student: z.lazy(() => StudentCreateNestedOneWithoutEnrollmentsInputObjectSchema),
  faculty: z.lazy(() => FacultyCreateNestedOneWithoutEnrollmentsInputObjectSchema),
  academicYear: z.lazy(() => AcademicYearCreateNestedOneWithoutEnrollmentsInputObjectSchema).optional()
}).strict();
export const EnrollmentCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  level: z.string(),
  enrollmentDate: z.date(),
  status: EnrollmentStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  student: z.lazy(() => StudentCreateNestedOneWithoutEnrollmentsInputObjectSchema),
  faculty: z.lazy(() => FacultyCreateNestedOneWithoutEnrollmentsInputObjectSchema),
  academicYear: z.lazy(() => AcademicYearCreateNestedOneWithoutEnrollmentsInputObjectSchema).optional()
}).strict();
