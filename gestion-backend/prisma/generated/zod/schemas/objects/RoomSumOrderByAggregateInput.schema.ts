import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const RoomSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.RoomSumOrderByAggregateInput, z.ZodTypeDef, Prisma.RoomSumOrderByAggregateInput> = z.object({
  capacity: SortOrderSchema.optional()
}).strict();
export const RoomSumOrderByAggregateInputObjectZodSchema = z.object({
  capacity: SortOrderSchema.optional()
}).strict();
