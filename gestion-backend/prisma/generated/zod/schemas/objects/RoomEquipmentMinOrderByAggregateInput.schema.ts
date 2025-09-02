import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const RoomEquipmentMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.RoomEquipmentMinOrderByAggregateInput, z.ZodTypeDef, Prisma.RoomEquipmentMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  roomId: SortOrderSchema.optional(),
  name: SortOrderSchema.optional()
}).strict();
export const RoomEquipmentMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  roomId: SortOrderSchema.optional(),
  name: SortOrderSchema.optional()
}).strict();
