import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const ScholarshipDocumentUpdateWithoutScholarshipApplicationInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentUpdateWithoutScholarshipApplicationInput, z.ZodTypeDef, Prisma.ScholarshipDocumentUpdateWithoutScholarshipApplicationInput> = z.object({
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const ScholarshipDocumentUpdateWithoutScholarshipApplicationInputObjectZodSchema = z.object({
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
