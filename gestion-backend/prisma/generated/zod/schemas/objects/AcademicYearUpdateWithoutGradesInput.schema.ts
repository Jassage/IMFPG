import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { EnrollmentUpdateManyWithoutAcademicYearNestedInputObjectSchema } from './EnrollmentUpdateManyWithoutAcademicYearNestedInput.schema';
import { CourseAssignmentUpdateManyWithoutAcademicYearNestedInputObjectSchema } from './CourseAssignmentUpdateManyWithoutAcademicYearNestedInput.schema';
import { PaymentUpdateManyWithoutAcademicYearNestedInputObjectSchema } from './PaymentUpdateManyWithoutAcademicYearNestedInput.schema';
import { ScholarshipUpdateManyWithoutAcademicYearNestedInputObjectSchema } from './ScholarshipUpdateManyWithoutAcademicYearNestedInput.schema'

export const AcademicYearUpdateWithoutGradesInputObjectSchema: z.ZodType<Prisma.AcademicYearUpdateWithoutGradesInput, z.ZodTypeDef, Prisma.AcademicYearUpdateWithoutGradesInput> = z.object({
  year: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  startDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  endDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  isCurrent: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  enrollments: z.lazy(() => EnrollmentUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  scholarship: z.lazy(() => ScholarshipUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional()
}).strict();
export const AcademicYearUpdateWithoutGradesInputObjectZodSchema = z.object({
  year: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  startDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  endDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  isCurrent: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  enrollments: z.lazy(() => EnrollmentUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  scholarship: z.lazy(() => ScholarshipUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional()
}).strict();
