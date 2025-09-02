import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const MessageAttachmentMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MessageAttachmentMinOrderByAggregateInput, z.ZodTypeDef, Prisma.MessageAttachmentMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  messageId: SortOrderSchema.optional(),
  url: SortOrderSchema.optional()
}).strict();
export const MessageAttachmentMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  messageId: SortOrderSchema.optional(),
  url: SortOrderSchema.optional()
}).strict();
