import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const ScholarshipDocumentUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentUncheckedUpdateInput, z.ZodTypeDef, Prisma.ScholarshipDocumentUncheckedUpdateInput> = z.object({
  scholarshipApplicationId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const ScholarshipDocumentUncheckedUpdateInputObjectZodSchema = z.object({
  scholarshipApplicationId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
