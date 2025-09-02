import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { StudentUpdateOneRequiredWithoutScholarshipApplicationsNestedInputObjectSchema } from './StudentUpdateOneRequiredWithoutScholarshipApplicationsNestedInput.schema';
import { ScholarshipDocumentUpdateManyWithoutScholarshipApplicationNestedInputObjectSchema } from './ScholarshipDocumentUpdateManyWithoutScholarshipApplicationNestedInput.schema'

export const ScholarshipApplicationUpdateWithoutScholarshipInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationUpdateWithoutScholarshipInput, z.ZodTypeDef, Prisma.ScholarshipApplicationUpdateWithoutScholarshipInput> = z.object({
  applicationDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  motivation: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  reviewNotes: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  student: z.lazy(() => StudentUpdateOneRequiredWithoutScholarshipApplicationsNestedInputObjectSchema).optional(),
  documents: z.lazy(() => ScholarshipDocumentUpdateManyWithoutScholarshipApplicationNestedInputObjectSchema).optional()
}).strict();
export const ScholarshipApplicationUpdateWithoutScholarshipInputObjectZodSchema = z.object({
  applicationDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  motivation: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  reviewNotes: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  student: z.lazy(() => StudentUpdateOneRequiredWithoutScholarshipApplicationsNestedInputObjectSchema).optional(),
  documents: z.lazy(() => ScholarshipDocumentUpdateManyWithoutScholarshipApplicationNestedInputObjectSchema).optional()
}).strict();
