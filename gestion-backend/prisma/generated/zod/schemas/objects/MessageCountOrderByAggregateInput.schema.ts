import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const MessageCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MessageCountOrderByAggregateInput, z.ZodTypeDef, Prisma.MessageCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  senderId: SortOrderSchema.optional(),
  receiverId: SortOrderSchema.optional(),
  subject: SortOrderSchema.optional(),
  content: SortOrderSchema.optional(),
  timestamp: SortOrderSchema.optional(),
  isRead: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional()
}).strict();
export const MessageCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  senderId: SortOrderSchema.optional(),
  receiverId: SortOrderSchema.optional(),
  subject: SortOrderSchema.optional(),
  content: SortOrderSchema.optional(),
  timestamp: SortOrderSchema.optional(),
  isRead: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional()
}).strict();
