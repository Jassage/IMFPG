import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const MessageMaxAggregateInputObjectSchema: z.ZodType<Prisma.MessageMaxAggregateInputType, z.ZodTypeDef, Prisma.MessageMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  senderId: z.literal(true).optional(),
  receiverId: z.literal(true).optional(),
  subject: z.literal(true).optional(),
  content: z.literal(true).optional(),
  timestamp: z.literal(true).optional(),
  isRead: z.literal(true).optional(),
  priority: z.literal(true).optional()
}).strict();
export const MessageMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  senderId: z.literal(true).optional(),
  receiverId: z.literal(true).optional(),
  subject: z.literal(true).optional(),
  content: z.literal(true).optional(),
  timestamp: z.literal(true).optional(),
  isRead: z.literal(true).optional(),
  priority: z.literal(true).optional()
}).strict();
