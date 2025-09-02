import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const UEPrerequisiteOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteOrderByRelationAggregateInput, z.ZodTypeDef, Prisma.UEPrerequisiteOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const UEPrerequisiteOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
