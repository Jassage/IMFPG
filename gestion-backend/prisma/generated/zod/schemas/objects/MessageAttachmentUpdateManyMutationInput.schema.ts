import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const MessageAttachmentUpdateManyMutationInputObjectSchema: z.ZodType<Prisma.MessageAttachmentUpdateManyMutationInput, z.ZodTypeDef, Prisma.MessageAttachmentUpdateManyMutationInput> = z.object({
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const MessageAttachmentUpdateManyMutationInputObjectZodSchema = z.object({
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
