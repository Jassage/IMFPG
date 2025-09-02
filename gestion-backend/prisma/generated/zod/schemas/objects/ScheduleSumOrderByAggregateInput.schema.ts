import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const ScheduleSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ScheduleSumOrderByAggregateInput, z.ZodTypeDef, Prisma.ScheduleSumOrderByAggregateInput> = z.object({
  dayOfWeek: SortOrderSchema.optional()
}).strict();
export const ScheduleSumOrderByAggregateInputObjectZodSchema = z.object({
  dayOfWeek: SortOrderSchema.optional()
}).strict();
