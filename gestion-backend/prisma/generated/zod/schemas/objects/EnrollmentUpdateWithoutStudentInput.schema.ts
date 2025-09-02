import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { EnrollmentStatusSchema } from '../enums/EnrollmentStatus.schema';
import { EnumEnrollmentStatusFieldUpdateOperationsInputObjectSchema } from './EnumEnrollmentStatusFieldUpdateOperationsInput.schema';
import { FacultyUpdateOneRequiredWithoutEnrollmentsNestedInputObjectSchema } from './FacultyUpdateOneRequiredWithoutEnrollmentsNestedInput.schema';
import { AcademicYearUpdateOneRequiredWithoutEnrollmentsNestedInputObjectSchema } from './AcademicYearUpdateOneRequiredWithoutEnrollmentsNestedInput.schema'

export const EnrollmentUpdateWithoutStudentInputObjectSchema: z.ZodType<Prisma.EnrollmentUpdateWithoutStudentInput, z.ZodTypeDef, Prisma.EnrollmentUpdateWithoutStudentInput> = z.object({
  level: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  enrollmentDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([EnrollmentStatusSchema, z.lazy(() => EnumEnrollmentStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  faculty: z.lazy(() => FacultyUpdateOneRequiredWithoutEnrollmentsNestedInputObjectSchema).optional(),
  academicYear: z.lazy(() => AcademicYearUpdateOneRequiredWithoutEnrollmentsNestedInputObjectSchema).optional()
}).strict();
export const EnrollmentUpdateWithoutStudentInputObjectZodSchema = z.object({
  level: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  enrollmentDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([EnrollmentStatusSchema, z.lazy(() => EnumEnrollmentStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  faculty: z.lazy(() => FacultyUpdateOneRequiredWithoutEnrollmentsNestedInputObjectSchema).optional(),
  academicYear: z.lazy(() => AcademicYearUpdateOneRequiredWithoutEnrollmentsNestedInputObjectSchema).optional()
}).strict();
