import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { RoomCountOrderByAggregateInputObjectSchema } from './RoomCountOrderByAggregateInput.schema';
import { RoomAvgOrderByAggregateInputObjectSchema } from './RoomAvgOrderByAggregateInput.schema';
import { RoomMaxOrderByAggregateInputObjectSchema } from './RoomMaxOrderByAggregateInput.schema';
import { RoomMinOrderByAggregateInputObjectSchema } from './RoomMinOrderByAggregateInput.schema';
import { RoomSumOrderByAggregateInputObjectSchema } from './RoomSumOrderByAggregateInput.schema'

export const RoomOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.RoomOrderByWithAggregationInput, z.ZodTypeDef, Prisma.RoomOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  capacity: SortOrderSchema.optional(),
  location: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  _count: z.lazy(() => RoomCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => RoomAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => RoomMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => RoomMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => RoomSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const RoomOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  capacity: SortOrderSchema.optional(),
  location: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  _count: z.lazy(() => RoomCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => RoomAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => RoomMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => RoomMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => RoomSumOrderByAggregateInputObjectSchema).optional()
}).strict();
