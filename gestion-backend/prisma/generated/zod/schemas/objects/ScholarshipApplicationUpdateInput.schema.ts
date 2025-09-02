import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { ScholarshipUpdateOneRequiredWithoutApplicationsNestedInputObjectSchema } from './ScholarshipUpdateOneRequiredWithoutApplicationsNestedInput.schema';
import { StudentUpdateOneRequiredWithoutScholarshipApplicationsNestedInputObjectSchema } from './StudentUpdateOneRequiredWithoutScholarshipApplicationsNestedInput.schema';
import { ScholarshipDocumentUpdateManyWithoutScholarshipApplicationNestedInputObjectSchema } from './ScholarshipDocumentUpdateManyWithoutScholarshipApplicationNestedInput.schema'

export const ScholarshipApplicationUpdateInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationUpdateInput, z.ZodTypeDef, Prisma.ScholarshipApplicationUpdateInput> = z.object({
  applicationDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  motivation: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  reviewNotes: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  scholarship: z.lazy(() => ScholarshipUpdateOneRequiredWithoutApplicationsNestedInputObjectSchema).optional(),
  student: z.lazy(() => StudentUpdateOneRequiredWithoutScholarshipApplicationsNestedInputObjectSchema).optional(),
  documents: z.lazy(() => ScholarshipDocumentUpdateManyWithoutScholarshipApplicationNestedInputObjectSchema).optional()
}).strict();
export const ScholarshipApplicationUpdateInputObjectZodSchema = z.object({
  applicationDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  motivation: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  reviewNotes: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  scholarship: z.lazy(() => ScholarshipUpdateOneRequiredWithoutApplicationsNestedInputObjectSchema).optional(),
  student: z.lazy(() => StudentUpdateOneRequiredWithoutScholarshipApplicationsNestedInputObjectSchema).optional(),
  documents: z.lazy(() => ScholarshipDocumentUpdateManyWithoutScholarshipApplicationNestedInputObjectSchema).optional()
}).strict();
