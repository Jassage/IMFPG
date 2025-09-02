import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const ScholarshipDocumentUpdateManyMutationInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentUpdateManyMutationInput, z.ZodTypeDef, Prisma.ScholarshipDocumentUpdateManyMutationInput> = z.object({
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const ScholarshipDocumentUpdateManyMutationInputObjectZodSchema = z.object({
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
