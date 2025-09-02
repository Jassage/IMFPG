import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const MessageCreateWithoutAttachmentsInputObjectSchema: z.ZodType<Prisma.MessageCreateWithoutAttachmentsInput, z.ZodTypeDef, Prisma.MessageCreateWithoutAttachmentsInput> = z.object({
  id: z.string().optional(),
  senderId: z.string(),
  receiverId: z.string(),
  subject: z.string().nullish(),
  content: z.string(),
  timestamp: z.date().optional(),
  isRead: z.boolean().optional(),
  priority: z.string()
}).strict();
export const MessageCreateWithoutAttachmentsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  senderId: z.string(),
  receiverId: z.string(),
  subject: z.string().nullish(),
  content: z.string(),
  timestamp: z.date().optional(),
  isRead: z.boolean().optional(),
  priority: z.string()
}).strict();
