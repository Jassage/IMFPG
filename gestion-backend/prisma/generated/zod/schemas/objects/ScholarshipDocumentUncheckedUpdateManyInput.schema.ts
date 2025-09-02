import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const ScholarshipDocumentUncheckedUpdateManyInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentUncheckedUpdateManyInput, z.ZodTypeDef, Prisma.ScholarshipDocumentUncheckedUpdateManyInput> = z.object({
  scholarshipApplicationId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const ScholarshipDocumentUncheckedUpdateManyInputObjectZodSchema = z.object({
  scholarshipApplicationId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
