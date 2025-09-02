import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { ScholarshipApplicationUpdateOneRequiredWithoutDocumentsNestedInputObjectSchema } from './ScholarshipApplicationUpdateOneRequiredWithoutDocumentsNestedInput.schema'

export const ScholarshipDocumentUpdateInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentUpdateInput, z.ZodTypeDef, Prisma.ScholarshipDocumentUpdateInput> = z.object({
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  scholarshipApplication: z.lazy(() => ScholarshipApplicationUpdateOneRequiredWithoutDocumentsNestedInputObjectSchema).optional()
}).strict();
export const ScholarshipDocumentUpdateInputObjectZodSchema = z.object({
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  scholarshipApplication: z.lazy(() => ScholarshipApplicationUpdateOneRequiredWithoutDocumentsNestedInputObjectSchema).optional()
}).strict();
