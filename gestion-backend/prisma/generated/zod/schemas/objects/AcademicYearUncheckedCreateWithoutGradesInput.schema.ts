import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema } from './EnrollmentUncheckedCreateNestedManyWithoutAcademicYearInput.schema';
import { CourseAssignmentUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema } from './CourseAssignmentUncheckedCreateNestedManyWithoutAcademicYearInput.schema';
import { PaymentUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema } from './PaymentUncheckedCreateNestedManyWithoutAcademicYearInput.schema';
import { ScholarshipUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema } from './ScholarshipUncheckedCreateNestedManyWithoutAcademicYearInput.schema'

export const AcademicYearUncheckedCreateWithoutGradesInputObjectSchema: z.ZodType<Prisma.AcademicYearUncheckedCreateWithoutGradesInput, z.ZodTypeDef, Prisma.AcademicYearUncheckedCreateWithoutGradesInput> = z.object({
  id: z.string().optional(),
  year: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  isCurrent: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  enrollments: z.lazy(() => EnrollmentUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  scholarship: z.lazy(() => ScholarshipUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema).optional()
}).strict();
export const AcademicYearUncheckedCreateWithoutGradesInputObjectZodSchema = z.object({
  id: z.string().optional(),
  year: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  isCurrent: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  enrollments: z.lazy(() => EnrollmentUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  scholarship: z.lazy(() => ScholarshipUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema).optional()
}).strict();
