import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema } from './GradeUncheckedCreateNestedManyWithoutAcademicYearInput.schema';
import { CourseAssignmentUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema } from './CourseAssignmentUncheckedCreateNestedManyWithoutAcademicYearInput.schema';
import { PaymentUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema } from './PaymentUncheckedCreateNestedManyWithoutAcademicYearInput.schema';
import { ScholarshipUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema } from './ScholarshipUncheckedCreateNestedManyWithoutAcademicYearInput.schema'

export const AcademicYearUncheckedCreateWithoutEnrollmentsInputObjectSchema: z.ZodType<Prisma.AcademicYearUncheckedCreateWithoutEnrollmentsInput, z.ZodTypeDef, Prisma.AcademicYearUncheckedCreateWithoutEnrollmentsInput> = z.object({
  id: z.string().optional(),
  year: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  isCurrent: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  grades: z.lazy(() => GradeUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  scholarship: z.lazy(() => ScholarshipUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema).optional()
}).strict();
export const AcademicYearUncheckedCreateWithoutEnrollmentsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  year: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  isCurrent: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  grades: z.lazy(() => GradeUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  scholarship: z.lazy(() => ScholarshipUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema).optional()
}).strict();
