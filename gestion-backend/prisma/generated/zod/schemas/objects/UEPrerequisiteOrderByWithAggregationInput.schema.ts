import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { UEPrerequisiteCountOrderByAggregateInputObjectSchema } from './UEPrerequisiteCountOrderByAggregateInput.schema';
import { UEPrerequisiteMaxOrderByAggregateInputObjectSchema } from './UEPrerequisiteMaxOrderByAggregateInput.schema';
import { UEPrerequisiteMinOrderByAggregateInputObjectSchema } from './UEPrerequisiteMinOrderByAggregateInput.schema'

export const UEPrerequisiteOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteOrderByWithAggregationInput, z.ZodTypeDef, Prisma.UEPrerequisiteOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  ueId: SortOrderSchema.optional(),
  prerequisiteId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => UEPrerequisiteCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => UEPrerequisiteMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => UEPrerequisiteMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const UEPrerequisiteOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  ueId: SortOrderSchema.optional(),
  prerequisiteId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => UEPrerequisiteCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => UEPrerequisiteMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => UEPrerequisiteMinOrderByAggregateInputObjectSchema).optional()
}).strict();
