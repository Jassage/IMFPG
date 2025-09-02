import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema } from './GradeUncheckedCreateNestedManyWithoutAcademicYearInput.schema';
import { EnrollmentUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema } from './EnrollmentUncheckedCreateNestedManyWithoutAcademicYearInput.schema';
import { CourseAssignmentUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema } from './CourseAssignmentUncheckedCreateNestedManyWithoutAcademicYearInput.schema';
import { ScholarshipUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema } from './ScholarshipUncheckedCreateNestedManyWithoutAcademicYearInput.schema'

export const AcademicYearUncheckedCreateWithoutPaymentsInputObjectSchema: z.ZodType<Prisma.AcademicYearUncheckedCreateWithoutPaymentsInput, z.ZodTypeDef, Prisma.AcademicYearUncheckedCreateWithoutPaymentsInput> = z.object({
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
  scholarship: z.lazy(() => ScholarshipUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema).optional()
}).strict();
export const AcademicYearUncheckedCreateWithoutPaymentsInputObjectZodSchema = z.object({
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
  scholarship: z.lazy(() => ScholarshipUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema).optional()
}).strict();
