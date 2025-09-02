import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { MessageAttachmentCountOrderByAggregateInputObjectSchema } from './MessageAttachmentCountOrderByAggregateInput.schema';
import { MessageAttachmentMaxOrderByAggregateInputObjectSchema } from './MessageAttachmentMaxOrderByAggregateInput.schema';
import { MessageAttachmentMinOrderByAggregateInputObjectSchema } from './MessageAttachmentMinOrderByAggregateInput.schema'

export const MessageAttachmentOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.MessageAttachmentOrderByWithAggregationInput, z.ZodTypeDef, Prisma.MessageAttachmentOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  messageId: SortOrderSchema.optional(),
  url: SortOrderSchema.optional(),
  _count: z.lazy(() => MessageAttachmentCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => MessageAttachmentMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => MessageAttachmentMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const MessageAttachmentOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  messageId: SortOrderSchema.optional(),
  url: SortOrderSchema.optional(),
  _count: z.lazy(() => MessageAttachmentCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => MessageAttachmentMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => MessageAttachmentMinOrderByAggregateInputObjectSchema).optional()
}).strict();
