import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const MessageAttachmentMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MessageAttachmentMaxOrderByAggregateInput, z.ZodTypeDef, Prisma.MessageAttachmentMaxOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  messageId: SortOrderSchema.optional(),
  url: SortOrderSchema.optional()
}).strict();
export const MessageAttachmentMaxOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  messageId: SortOrderSchema.optional(),
  url: SortOrderSchema.optional()
}).strict();
