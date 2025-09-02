import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const FacultyLevelOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.FacultyLevelOrderByRelationAggregateInput, z.ZodTypeDef, Prisma.FacultyLevelOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const FacultyLevelOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
