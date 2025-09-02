import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const TranscriptOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.TranscriptOrderByRelationAggregateInput, z.ZodTypeDef, Prisma.TranscriptOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const TranscriptOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
