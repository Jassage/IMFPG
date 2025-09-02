import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { MessageAttachmentFindManySchema } from '../findManyMessageAttachment.schema';
import { MessageCountOutputTypeArgsObjectSchema } from './MessageCountOutputTypeArgs.schema'

export const MessageSelectObjectSchema: z.ZodType<Prisma.MessageSelect, z.ZodTypeDef, Prisma.MessageSelect> = z.object({
  id: z.boolean().optional(),
  senderId: z.boolean().optional(),
  receiverId: z.boolean().optional(),
  subject: z.boolean().optional(),
  content: z.boolean().optional(),
  timestamp: z.boolean().optional(),
  isRead: z.boolean().optional(),
  attachments: z.union([z.boolean(), z.lazy(() => MessageAttachmentFindManySchema)]).optional(),
  priority: z.boolean().optional(),
  _count: z.union([z.boolean(), z.lazy(() => MessageCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const MessageSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  senderId: z.boolean().optional(),
  receiverId: z.boolean().optional(),
  subject: z.boolean().optional(),
  content: z.boolean().optional(),
  timestamp: z.boolean().optional(),
  isRead: z.boolean().optional(),
  attachments: z.union([z.boolean(), z.lazy(() => MessageAttachmentFindManySchema)]).optional(),
  priority: z.boolean().optional(),
  _count: z.union([z.boolean(), z.lazy(() => MessageCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
