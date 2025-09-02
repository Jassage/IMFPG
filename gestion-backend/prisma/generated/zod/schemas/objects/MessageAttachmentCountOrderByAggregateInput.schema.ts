import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const MessageAttachmentCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MessageAttachmentCountOrderByAggregateInput, z.ZodTypeDef, Prisma.MessageAttachmentCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  messageId: SortOrderSchema.optional(),
  url: SortOrderSchema.optional()
}).strict();
export const MessageAttachmentCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  messageId: SortOrderSchema.optional(),
  url: SortOrderSchema.optional()
}).strict();
