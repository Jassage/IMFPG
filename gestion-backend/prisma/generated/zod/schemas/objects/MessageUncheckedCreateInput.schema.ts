import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { MessageAttachmentUncheckedCreateNestedManyWithoutMessageInputObjectSchema } from './MessageAttachmentUncheckedCreateNestedManyWithoutMessageInput.schema'

export const MessageUncheckedCreateInputObjectSchema: z.ZodType<Prisma.MessageUncheckedCreateInput, z.ZodTypeDef, Prisma.MessageUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  senderId: z.string(),
  receiverId: z.string(),
  subject: z.string().nullish(),
  content: z.string(),
  timestamp: z.date().optional(),
  isRead: z.boolean().optional(),
  priority: z.string(),
  attachments: z.lazy(() => MessageAttachmentUncheckedCreateNestedManyWithoutMessageInputObjectSchema).optional()
}).strict();
export const MessageUncheckedCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  senderId: z.string(),
  receiverId: z.string(),
  subject: z.string().nullish(),
  content: z.string(),
  timestamp: z.date().optional(),
  isRead: z.boolean().optional(),
  priority: z.string(),
  attachments: z.lazy(() => MessageAttachmentUncheckedCreateNestedManyWithoutMessageInputObjectSchema).optional()
}).strict();
