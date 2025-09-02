import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const MessageAttachmentUncheckedUpdateManyInputObjectSchema: z.ZodType<Prisma.MessageAttachmentUncheckedUpdateManyInput, z.ZodTypeDef, Prisma.MessageAttachmentUncheckedUpdateManyInput> = z.object({
  messageId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const MessageAttachmentUncheckedUpdateManyInputObjectZodSchema = z.object({
  messageId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
