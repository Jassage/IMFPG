import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { MessageCreateNestedOneWithoutAttachmentsInputObjectSchema } from './MessageCreateNestedOneWithoutAttachmentsInput.schema'

export const MessageAttachmentCreateInputObjectSchema: z.ZodType<Prisma.MessageAttachmentCreateInput, z.ZodTypeDef, Prisma.MessageAttachmentCreateInput> = z.object({
  id: z.string().optional(),
  url: z.string(),
  message: z.lazy(() => MessageCreateNestedOneWithoutAttachmentsInputObjectSchema)
}).strict();
export const MessageAttachmentCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  url: z.string(),
  message: z.lazy(() => MessageCreateNestedOneWithoutAttachmentsInputObjectSchema)
}).strict();
