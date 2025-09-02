import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const MessageUncheckedCreateWithoutAttachmentsInputObjectSchema: z.ZodType<Prisma.MessageUncheckedCreateWithoutAttachmentsInput, z.ZodTypeDef, Prisma.MessageUncheckedCreateWithoutAttachmentsInput> = z.object({
  id: z.string().optional(),
  senderId: z.string(),
  receiverId: z.string(),
  subject: z.string().nullish(),
  content: z.string(),
  timestamp: z.date().optional(),
  isRead: z.boolean().optional(),
  priority: z.string()
}).strict();
export const MessageUncheckedCreateWithoutAttachmentsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  senderId: z.string(),
  receiverId: z.string(),
  subject: z.string().nullish(),
  content: z.string(),
  timestamp: z.date().optional(),
  isRead: z.boolean().optional(),
  priority: z.string()
}).strict();
