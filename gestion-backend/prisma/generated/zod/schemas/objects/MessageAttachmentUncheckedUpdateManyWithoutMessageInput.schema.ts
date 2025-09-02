import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const MessageAttachmentUncheckedUpdateManyWithoutMessageInputObjectSchema: z.ZodType<Prisma.MessageAttachmentUncheckedUpdateManyWithoutMessageInput, z.ZodTypeDef, Prisma.MessageAttachmentUncheckedUpdateManyWithoutMessageInput> = z.object({
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const MessageAttachmentUncheckedUpdateManyWithoutMessageInputObjectZodSchema = z.object({
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
