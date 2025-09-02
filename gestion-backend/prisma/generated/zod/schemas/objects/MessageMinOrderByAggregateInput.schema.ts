import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const MessageMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MessageMinOrderByAggregateInput, z.ZodTypeDef, Prisma.MessageMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  senderId: SortOrderSchema.optional(),
  receiverId: SortOrderSchema.optional(),
  subject: SortOrderSchema.optional(),
  content: SortOrderSchema.optional(),
  timestamp: SortOrderSchema.optional(),
  isRead: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional()
}).strict();
export const MessageMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  senderId: SortOrderSchema.optional(),
  receiverId: SortOrderSchema.optional(),
  subject: SortOrderSchema.optional(),
  content: SortOrderSchema.optional(),
  timestamp: SortOrderSchema.optional(),
  isRead: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional()
}).strict();
