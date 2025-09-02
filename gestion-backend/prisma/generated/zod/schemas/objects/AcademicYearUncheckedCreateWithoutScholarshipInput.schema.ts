import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema } from './GradeUncheckedCreateNestedManyWithoutAcademicYearInput.schema';
import { EnrollmentUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema } from './EnrollmentUncheckedCreateNestedManyWithoutAcademicYearInput.schema';
import { CourseAssignmentUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema } from './CourseAssignmentUncheckedCreateNestedManyWithoutAcademicYearInput.schema';
import { PaymentUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema } from './PaymentUncheckedCreateNestedManyWithoutAcademicYearInput.schema'

export const AcademicYearUncheckedCreateWithoutScholarshipInputObjectSchema: z.ZodType<Prisma.AcademicYearUncheckedCreateWithoutScholarshipInput, z.ZodTypeDef, Prisma.AcademicYearUncheckedCreateWithoutScholarshipInput> = z.object({
  id: z.string().optional(),
  year: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  isCurrent: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  grades: z.lazy(() => GradeUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema).optional()
}).strict();
export const AcademicYearUncheckedCreateWithoutScholarshipInputObjectZodSchema = z.object({
  id: z.string().optional(),
  year: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  isCurrent: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  grades: z.lazy(() => GradeUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema).optional()
}).strict();
