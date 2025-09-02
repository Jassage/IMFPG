import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const ScholarshipDocumentUncheckedUpdateManyWithoutScholarshipApplicationInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentUncheckedUpdateManyWithoutScholarshipApplicationInput, z.ZodTypeDef, Prisma.ScholarshipDocumentUncheckedUpdateManyWithoutScholarshipApplicationInput> = z.object({
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const ScholarshipDocumentUncheckedUpdateManyWithoutScholarshipApplicationInputObjectZodSchema = z.object({
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
