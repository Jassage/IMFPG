import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { GradeUncheckedUpdateManyWithoutAcademicYearNestedInputObjectSchema } from './GradeUncheckedUpdateManyWithoutAcademicYearNestedInput.schema';
import { EnrollmentUncheckedUpdateManyWithoutAcademicYearNestedInputObjectSchema } from './EnrollmentUncheckedUpdateManyWithoutAcademicYearNestedInput.schema';
import { CourseAssignmentUncheckedUpdateManyWithoutAcademicYearNestedInputObjectSchema } from './CourseAssignmentUncheckedUpdateManyWithoutAcademicYearNestedInput.schema';
import { PaymentUncheckedUpdateManyWithoutAcademicYearNestedInputObjectSchema } from './PaymentUncheckedUpdateManyWithoutAcademicYearNestedInput.schema';
import { ScholarshipUncheckedUpdateManyWithoutAcademicYearNestedInputObjectSchema } from './ScholarshipUncheckedUpdateManyWithoutAcademicYearNestedInput.schema'

export const AcademicYearUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.AcademicYearUncheckedUpdateInput, z.ZodTypeDef, Prisma.AcademicYearUncheckedUpdateInput> = z.object({
  year: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  startDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  endDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  isCurrent: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  grades: z.lazy(() => GradeUncheckedUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentUncheckedUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentUncheckedUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentUncheckedUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  scholarship: z.lazy(() => ScholarshipUncheckedUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional()
}).strict();
export const AcademicYearUncheckedUpdateInputObjectZodSchema = z.object({
  year: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  startDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  endDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  isCurrent: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  grades: z.lazy(() => GradeUncheckedUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentUncheckedUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentUncheckedUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentUncheckedUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  scholarship: z.lazy(() => ScholarshipUncheckedUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional()
}).strict();
