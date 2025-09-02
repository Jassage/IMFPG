import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const ScholarshipDocumentUncheckedUpdateWithoutScholarshipApplicationInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentUncheckedUpdateWithoutScholarshipApplicationInput, z.ZodTypeDef, Prisma.ScholarshipDocumentUncheckedUpdateWithoutScholarshipApplicationInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const ScholarshipDocumentUncheckedUpdateWithoutScholarshipApplicationInputObjectZodSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
