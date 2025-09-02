import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const AttendanceOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.AttendanceOrderByRelationAggregateInput, z.ZodTypeDef, Prisma.AttendanceOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const AttendanceOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
