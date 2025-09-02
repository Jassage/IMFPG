import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const RoomAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.RoomAvgOrderByAggregateInput, z.ZodTypeDef, Prisma.RoomAvgOrderByAggregateInput> = z.object({
  capacity: SortOrderSchema.optional()
}).strict();
export const RoomAvgOrderByAggregateInputObjectZodSchema = z.object({
  capacity: SortOrderSchema.optional()
}).strict();
