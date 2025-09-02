import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { MessageCountOrderByAggregateInputObjectSchema } from './MessageCountOrderByAggregateInput.schema';
import { MessageMaxOrderByAggregateInputObjectSchema } from './MessageMaxOrderByAggregateInput.schema';
import { MessageMinOrderByAggregateInputObjectSchema } from './MessageMinOrderByAggregateInput.schema'

export const MessageOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.MessageOrderByWithAggregationInput, z.ZodTypeDef, Prisma.MessageOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  senderId: SortOrderSchema.optional(),
  receiverId: SortOrderSchema.optional(),
  subject: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  content: SortOrderSchema.optional(),
  timestamp: SortOrderSchema.optional(),
  isRead: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional(),
  _count: z.lazy(() => MessageCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => MessageMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => MessageMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const MessageOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  senderId: SortOrderSchema.optional(),
  receiverId: SortOrderSchema.optional(),
  subject: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  content: SortOrderSchema.optional(),
  timestamp: SortOrderSchema.optional(),
  isRead: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional(),
  _count: z.lazy(() => MessageCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => MessageMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => MessageMinOrderByAggregateInputObjectSchema).optional()
}).strict();
