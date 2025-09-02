import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const RoomEquipmentMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.RoomEquipmentMaxOrderByAggregateInput, z.ZodTypeDef, Prisma.RoomEquipmentMaxOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  roomId: SortOrderSchema.optional(),
  name: SortOrderSchema.optional()
}).strict();
export const RoomEquipmentMaxOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  roomId: SortOrderSchema.optional(),
  name: SortOrderSchema.optional()
}).strict();
