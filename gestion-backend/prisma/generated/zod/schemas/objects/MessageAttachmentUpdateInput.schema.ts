import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { MessageUpdateOneRequiredWithoutAttachmentsNestedInputObjectSchema } from './MessageUpdateOneRequiredWithoutAttachmentsNestedInput.schema'

export const MessageAttachmentUpdateInputObjectSchema: z.ZodType<Prisma.MessageAttachmentUpdateInput, z.ZodTypeDef, Prisma.MessageAttachmentUpdateInput> = z.object({
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  message: z.lazy(() => MessageUpdateOneRequiredWithoutAttachmentsNestedInputObjectSchema).optional()
}).strict();
export const MessageAttachmentUpdateInputObjectZodSchema = z.object({
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  message: z.lazy(() => MessageUpdateOneRequiredWithoutAttachmentsNestedInputObjectSchema).optional()
}).strict();
