import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const MessageAttachmentOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.MessageAttachmentOrderByRelationAggregateInput, z.ZodTypeDef, Prisma.MessageAttachmentOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const MessageAttachmentOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
