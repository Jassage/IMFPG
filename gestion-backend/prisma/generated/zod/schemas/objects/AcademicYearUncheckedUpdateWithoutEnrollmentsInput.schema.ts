import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { GradeUncheckedUpdateManyWithoutAcademicYearNestedInputObjectSchema } from './GradeUncheckedUpdateManyWithoutAcademicYearNestedInput.schema';
import { CourseAssignmentUncheckedUpdateManyWithoutAcademicYearNestedInputObjectSchema } from './CourseAssignmentUncheckedUpdateManyWithoutAcademicYearNestedInput.schema';
import { PaymentUncheckedUpdateManyWithoutAcademicYearNestedInputObjectSchema } from './PaymentUncheckedUpdateManyWithoutAcademicYearNestedInput.schema';
import { ScholarshipUncheckedUpdateManyWithoutAcademicYearNestedInputObjectSchema } from './ScholarshipUncheckedUpdateManyWithoutAcademicYearNestedInput.schema'

export const AcademicYearUncheckedUpdateWithoutEnrollmentsInputObjectSchema: z.ZodType<Prisma.AcademicYearUncheckedUpdateWithoutEnrollmentsInput, z.ZodTypeDef, Prisma.AcademicYearUncheckedUpdateWithoutEnrollmentsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  year: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  startDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  endDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  isCurrent: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  grades: z.lazy(() => GradeUncheckedUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentUncheckedUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentUncheckedUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  scholarship: z.lazy(() => ScholarshipUncheckedUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional()
}).strict();
export const AcademicYearUncheckedUpdateWithoutEnrollmentsInputObjectZodSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  year: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  startDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  endDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  isCurrent: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  grades: z.lazy(() => GradeUncheckedUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentUncheckedUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentUncheckedUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  scholarship: z.lazy(() => ScholarshipUncheckedUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional()
}).strict();
