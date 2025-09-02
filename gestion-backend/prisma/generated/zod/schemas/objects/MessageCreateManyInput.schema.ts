import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const MessageCreateManyInputObjectSchema: z.ZodType<Prisma.MessageCreateManyInput, z.ZodTypeDef, Prisma.MessageCreateManyInput> = z.object({
  id: z.string().optional(),
  senderId: z.string(),
  receiverId: z.string(),
  subject: z.string().nullish(),
  content: z.string(),
  timestamp: z.date().optional(),
  isRead: z.boolean().optional(),
  priority: z.string()
}).strict();
export const MessageCreateManyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  senderId: z.string(),
  receiverId: z.string(),
  subject: z.string().nullish(),
  content: z.string(),
  timestamp: z.date().optional(),
  isRead: z.boolean().optional(),
  priority: z.string()
}).strict();
