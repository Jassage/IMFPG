import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeCreateNestedManyWithoutAcademicYearInputObjectSchema } from './GradeCreateNestedManyWithoutAcademicYearInput.schema';
import { EnrollmentCreateNestedManyWithoutAcademicYearInputObjectSchema } from './EnrollmentCreateNestedManyWithoutAcademicYearInput.schema';
import { CourseAssignmentCreateNestedManyWithoutAcademicYearInputObjectSchema } from './CourseAssignmentCreateNestedManyWithoutAcademicYearInput.schema';
import { PaymentCreateNestedManyWithoutAcademicYearInputObjectSchema } from './PaymentCreateNestedManyWithoutAcademicYearInput.schema'

export const AcademicYearCreateWithoutScholarshipInputObjectSchema: z.ZodType<Prisma.AcademicYearCreateWithoutScholarshipInput, z.ZodTypeDef, Prisma.AcademicYearCreateWithoutScholarshipInput> = z.object({
  id: z.string().optional(),
  year: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  isCurrent: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  grades: z.lazy(() => GradeCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentCreateNestedManyWithoutAcademicYearInputObjectSchema).optional()
}).strict();
export const AcademicYearCreateWithoutScholarshipInputObjectZodSchema = z.object({
  id: z.string().optional(),
  year: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  isCurrent: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  grades: z.lazy(() => GradeCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentCreateNestedManyWithoutAcademicYearInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentCreateNestedManyWithoutAcademicYearInputObjectSchema).optional()
}).strict();
