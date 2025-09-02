import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const RoomEquipmentOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.RoomEquipmentOrderByRelationAggregateInput, z.ZodTypeDef, Prisma.RoomEquipmentOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const RoomEquipmentOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
