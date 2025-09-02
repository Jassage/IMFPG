import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const RoomEquipmentCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.RoomEquipmentCountOrderByAggregateInput, z.ZodTypeDef, Prisma.RoomEquipmentCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  roomId: SortOrderSchema.optional(),
  name: SortOrderSchema.optional()
}).strict();
export const RoomEquipmentCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  roomId: SortOrderSchema.optional(),
  name: SortOrderSchema.optional()
}).strict();
