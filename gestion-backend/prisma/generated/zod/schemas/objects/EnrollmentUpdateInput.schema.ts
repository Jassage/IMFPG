import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { EnrollmentStatusSchema } from '../enums/EnrollmentStatus.schema';
import { EnumEnrollmentStatusFieldUpdateOperationsInputObjectSchema } from './EnumEnrollmentStatusFieldUpdateOperationsInput.schema';
import { StudentUpdateOneRequiredWithoutEnrollmentsNestedInputObjectSchema } from './StudentUpdateOneRequiredWithoutEnrollmentsNestedInput.schema';
import { FacultyUpdateOneRequiredWithoutEnrollmentsNestedInputObjectSchema } from './FacultyUpdateOneRequiredWithoutEnrollmentsNestedInput.schema';
import { AcademicYearUpdateOneRequiredWithoutEnrollmentsNestedInputObjectSchema } from './AcademicYearUpdateOneRequiredWithoutEnrollmentsNestedInput.schema'

export const EnrollmentUpdateInputObjectSchema: z.ZodType<Prisma.EnrollmentUpdateInput, z.ZodTypeDef, Prisma.EnrollmentUpdateInput> = z.object({
  level: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  enrollmentDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([EnrollmentStatusSchema, z.lazy(() => EnumEnrollmentStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  student: z.lazy(() => StudentUpdateOneRequiredWithoutEnrollmentsNestedInputObjectSchema).optional(),
  faculty: z.lazy(() => FacultyUpdateOneRequiredWithoutEnrollmentsNestedInputObjectSchema).optional(),
  academicYear: z.lazy(() => AcademicYearUpdateOneRequiredWithoutEnrollmentsNestedInputObjectSchema).optional()
}).strict();
export const EnrollmentUpdateInputObjectZodSchema = z.object({
  level: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  enrollmentDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([EnrollmentStatusSchema, z.lazy(() => EnumEnrollmentStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  student: z.lazy(() => StudentUpdateOneRequiredWithoutEnrollmentsNestedInputObjectSchema).optional(),
  faculty: z.lazy(() => FacultyUpdateOneRequiredWithoutEnrollmentsNestedInputObjectSchema).optional(),
  academicYear: z.lazy(() => AcademicYearUpdateOneRequiredWithoutEnrollmentsNestedInputObjectSchema).optional()
}).strict();
