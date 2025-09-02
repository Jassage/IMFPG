import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const MessageAttachmentUpdateWithoutMessageInputObjectSchema: z.ZodType<Prisma.MessageAttachmentUpdateWithoutMessageInput, z.ZodTypeDef, Prisma.MessageAttachmentUpdateWithoutMessageInput> = z.object({
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const MessageAttachmentUpdateWithoutMessageInputObjectZodSchema = z.object({
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
