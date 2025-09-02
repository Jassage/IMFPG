import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { GradeUpdateManyWithoutAcademicYearNestedInputObjectSchema } from './GradeUpdateManyWithoutAcademicYearNestedInput.schema';
import { EnrollmentUpdateManyWithoutAcademicYearNestedInputObjectSchema } from './EnrollmentUpdateManyWithoutAcademicYearNestedInput.schema';
import { CourseAssignmentUpdateManyWithoutAcademicYearNestedInputObjectSchema } from './CourseAssignmentUpdateManyWithoutAcademicYearNestedInput.schema';
import { PaymentUpdateManyWithoutAcademicYearNestedInputObjectSchema } from './PaymentUpdateManyWithoutAcademicYearNestedInput.schema'

export const AcademicYearUpdateWithoutScholarshipInputObjectSchema: z.ZodType<Prisma.AcademicYearUpdateWithoutScholarshipInput, z.ZodTypeDef, Prisma.AcademicYearUpdateWithoutScholarshipInput> = z.object({
  year: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  startDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  endDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  isCurrent: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  grades: z.lazy(() => GradeUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional()
}).strict();
export const AcademicYearUpdateWithoutScholarshipInputObjectZodSchema = z.object({
  year: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  startDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  endDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  isCurrent: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  grades: z.lazy(() => GradeUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional()
}).strict();
