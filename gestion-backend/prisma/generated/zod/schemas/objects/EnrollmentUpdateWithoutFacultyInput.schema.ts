import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { EnrollmentStatusSchema } from '../enums/EnrollmentStatus.schema';
import { EnumEnrollmentStatusFieldUpdateOperationsInputObjectSchema } from './EnumEnrollmentStatusFieldUpdateOperationsInput.schema';
import { StudentUpdateOneRequiredWithoutEnrollmentsNestedInputObjectSchema } from './StudentUpdateOneRequiredWithoutEnrollmentsNestedInput.schema';
import { AcademicYearUpdateOneRequiredWithoutEnrollmentsNestedInputObjectSchema } from './AcademicYearUpdateOneRequiredWithoutEnrollmentsNestedInput.schema'

export const EnrollmentUpdateWithoutFacultyInputObjectSchema: z.ZodType<Prisma.EnrollmentUpdateWithoutFacultyInput, z.ZodTypeDef, Prisma.EnrollmentUpdateWithoutFacultyInput> = z.object({
  level: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  enrollmentDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([EnrollmentStatusSchema, z.lazy(() => EnumEnrollmentStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  student: z.lazy(() => StudentUpdateOneRequiredWithoutEnrollmentsNestedInputObjectSchema).optional(),
  academicYear: z.lazy(() => AcademicYearUpdateOneRequiredWithoutEnrollmentsNestedInputObjectSchema).optional()
}).strict();
export const EnrollmentUpdateWithoutFacultyInputObjectZodSchema = z.object({
  level: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  enrollmentDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([EnrollmentStatusSchema, z.lazy(() => EnumEnrollmentStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  student: z.lazy(() => StudentUpdateOneRequiredWithoutEnrollmentsNestedInputObjectSchema).optional(),
  academicYear: z.lazy(() => AcademicYearUpdateOneRequiredWithoutEnrollmentsNestedInputObjectSchema).optional()
}).strict();
