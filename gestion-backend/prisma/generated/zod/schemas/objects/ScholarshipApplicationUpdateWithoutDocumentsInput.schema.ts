import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { ScholarshipUpdateOneRequiredWithoutApplicationsNestedInputObjectSchema } from './ScholarshipUpdateOneRequiredWithoutApplicationsNestedInput.schema';
import { StudentUpdateOneRequiredWithoutScholarshipApplicationsNestedInputObjectSchema } from './StudentUpdateOneRequiredWithoutScholarshipApplicationsNestedInput.schema'

export const ScholarshipApplicationUpdateWithoutDocumentsInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationUpdateWithoutDocumentsInput, z.ZodTypeDef, Prisma.ScholarshipApplicationUpdateWithoutDocumentsInput> = z.object({
  applicationDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  motivation: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  reviewNotes: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  scholarship: z.lazy(() => ScholarshipUpdateOneRequiredWithoutApplicationsNestedInputObjectSchema).optional(),
  student: z.lazy(() => StudentUpdateOneRequiredWithoutScholarshipApplicationsNestedInputObjectSchema).optional()
}).strict();
export const ScholarshipApplicationUpdateWithoutDocumentsInputObjectZodSchema = z.object({
  applicationDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  motivation: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  reviewNotes: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  scholarship: z.lazy(() => ScholarshipUpdateOneRequiredWithoutApplicationsNestedInputObjectSchema).optional(),
  student: z.lazy(() => StudentUpdateOneRequiredWithoutScholarshipApplicationsNestedInputObjectSchema).optional()
}).strict();
