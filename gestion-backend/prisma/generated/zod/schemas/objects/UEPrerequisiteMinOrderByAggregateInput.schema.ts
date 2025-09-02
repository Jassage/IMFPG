import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const UEPrerequisiteMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteMinOrderByAggregateInput, z.ZodTypeDef, Prisma.UEPrerequisiteMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  ueId: SortOrderSchema.optional(),
  prerequisiteId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const UEPrerequisiteMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  ueId: SortOrderSchema.optional(),
  prerequisiteId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
