import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const ScholarshipDocumentOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentOrderByRelationAggregateInput, z.ZodTypeDef, Prisma.ScholarshipDocumentOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const ScholarshipDocumentOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
