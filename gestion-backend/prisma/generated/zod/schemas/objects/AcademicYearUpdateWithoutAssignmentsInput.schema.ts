import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { GradeUpdateManyWithoutAcademicYearNestedInputObjectSchema } from './GradeUpdateManyWithoutAcademicYearNestedInput.schema';
import { EnrollmentUpdateManyWithoutAcademicYearNestedInputObjectSchema } from './EnrollmentUpdateManyWithoutAcademicYearNestedInput.schema';
import { PaymentUpdateManyWithoutAcademicYearNestedInputObjectSchema } from './PaymentUpdateManyWithoutAcademicYearNestedInput.schema';
import { ScholarshipUpdateManyWithoutAcademicYearNestedInputObjectSchema } from './ScholarshipUpdateManyWithoutAcademicYearNestedInput.schema'

export const AcademicYearUpdateWithoutAssignmentsInputObjectSchema: z.ZodType<Prisma.AcademicYearUpdateWithoutAssignmentsInput, z.ZodTypeDef, Prisma.AcademicYearUpdateWithoutAssignmentsInput> = z.object({
  year: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  startDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  endDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  isCurrent: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  grades: z.lazy(() => GradeUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  scholarship: z.lazy(() => ScholarshipUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional()
}).strict();
export const AcademicYearUpdateWithoutAssignmentsInputObjectZodSchema = z.object({
  year: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  startDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  endDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  isCurrent: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  grades: z.lazy(() => GradeUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional(),
  scholarship: z.lazy(() => ScholarshipUpdateManyWithoutAcademicYearNestedInputObjectSchema).optional()
}).strict();
