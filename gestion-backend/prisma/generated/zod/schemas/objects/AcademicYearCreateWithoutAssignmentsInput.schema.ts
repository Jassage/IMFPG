import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeCreateNestedManyWithoutAcademicYearInputObjectSchema } from './GradeCreateNestedManyWithoutAcademicYearInput.schema';
import { EnrollmentCreateNestedManyWithoutAcademicYearInputObjectSchema } from './EnrollmentCreateNestedManyWithoutAcademicYearInput.schema';
import { PaymentCreateNestedManyWithoutAcademicYearInputObjectSchema } from './PaymentCreateNestedManyWithoutAcademicYearInput.schema';
import { ScholarshipCreateNestedManyWithoutAcademicYearInputObjectSchema } from './ScholarshipCreateNestedManyWithoutAcademicYearInput.schema'

export const AcademicYearCreateWithoutAssignmentsInputObjectSchema: z.ZodType<Prisma.AcademicYearCreateWithoutAssignmentsInput, z.ZodTypeDef, Prisma.AcademicYearCreateWithoutAssignmentsInput> = z.object({
  id: z.string().optional(),
  year: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  isCurrent: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  grades: z.lazy(() => GradeCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  scholarship: z.lazy(() => ScholarshipCreateNestedManyWithoutAcademicYearInputObjectSchema).optional()
}).strict();
export const AcademicYearCreateWithoutAssignmentsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  year: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  isCurrent: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  grades: z.lazy(() => GradeCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  scholarship: z.lazy(() => ScholarshipCreateNestedManyWithoutAcademicYearInputObjectSchema).optional()
}).strict();
