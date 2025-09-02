import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { MessageAttachmentCreateNestedManyWithoutMessageInputObjectSchema } from './MessageAttachmentCreateNestedManyWithoutMessageInput.schema'

export const MessageCreateInputObjectSchema: z.ZodType<Prisma.MessageCreateInput, z.ZodTypeDef, Prisma.MessageCreateInput> = z.object({
  id: z.string().optional(),
  senderId: z.string(),
  receiverId: z.string(),
  subject: z.string().nullish(),
  content: z.string(),
  timestamp: z.date().optional(),
  isRead: z.boolean().optional(),
  priority: z.string(),
  attachments: z.lazy(() => MessageAttachmentCreateNestedManyWithoutMessageInputObjectSchema).optional()
}).strict();
export const MessageCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  senderId: z.string(),
  receiverId: z.string(),
  subject: z.string().nullish(),
  content: z.string(),
  timestamp: z.date().optional(),
  isRead: z.boolean().optional(),
  priority: z.string(),
  attachments: z.lazy(() => MessageAttachmentCreateNestedManyWithoutMessageInputObjectSchema).optional()
}).strict();
