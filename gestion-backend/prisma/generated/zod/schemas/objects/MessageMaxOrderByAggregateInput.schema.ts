import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const MessageMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MessageMaxOrderByAggregateInput, z.ZodTypeDef, Prisma.MessageMaxOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  senderId: SortOrderSchema.optional(),
  receiverId: SortOrderSchema.optional(),
  subject: SortOrderSchema.optional(),
  content: SortOrderSchema.optional(),
  timestamp: SortOrderSchema.optional(),
  isRead: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional()
}).strict();
export const MessageMaxOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  senderId: SortOrderSchema.optional(),
  receiverId: SortOrderSchema.optional(),
  subject: SortOrderSchema.optional(),
  content: SortOrderSchema.optional(),
  timestamp: SortOrderSchema.optional(),
  isRead: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional()
}).strict();
