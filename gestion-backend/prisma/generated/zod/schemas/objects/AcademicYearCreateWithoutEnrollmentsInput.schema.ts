import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeCreateNestedManyWithoutAcademicYearInputObjectSchema } from './GradeCreateNestedManyWithoutAcademicYearInput.schema';
import { CourseAssignmentCreateNestedManyWithoutAcademicYearInputObjectSchema } from './CourseAssignmentCreateNestedManyWithoutAcademicYearInput.schema';
import { PaymentCreateNestedManyWithoutAcademicYearInputObjectSchema } from './PaymentCreateNestedManyWithoutAcademicYearInput.schema';
import { ScholarshipCreateNestedManyWithoutAcademicYearInputObjectSchema } from './ScholarshipCreateNestedManyWithoutAcademicYearInput.schema'

export const AcademicYearCreateWithoutEnrollmentsInputObjectSchema: z.ZodType<Prisma.AcademicYearCreateWithoutEnrollmentsInput, z.ZodTypeDef, Prisma.AcademicYearCreateWithoutEnrollmentsInput> = z.object({
  id: z.string().optional(),
  year: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  isCurrent: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  grades: z.lazy(() => GradeCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  scholarship: z.lazy(() => ScholarshipCreateNestedManyWithoutAcademicYearInputObjectSchema).optional()
}).strict();
export const AcademicYearCreateWithoutEnrollmentsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  year: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  isCurrent: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  grades: z.lazy(() => GradeCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  scholarship: z.lazy(() => ScholarshipCreateNestedManyWithoutAcademicYearInputObjectSchema).optional()
}).strict();
