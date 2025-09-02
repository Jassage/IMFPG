import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { RoomEquipmentCountOrderByAggregateInputObjectSchema } from './RoomEquipmentCountOrderByAggregateInput.schema';
import { RoomEquipmentMaxOrderByAggregateInputObjectSchema } from './RoomEquipmentMaxOrderByAggregateInput.schema';
import { RoomEquipmentMinOrderByAggregateInputObjectSchema } from './RoomEquipmentMinOrderByAggregateInput.schema'

export const RoomEquipmentOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.RoomEquipmentOrderByWithAggregationInput, z.ZodTypeDef, Prisma.RoomEquipmentOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  roomId: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  _count: z.lazy(() => RoomEquipmentCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => RoomEquipmentMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => RoomEquipmentMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const RoomEquipmentOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  roomId: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  _count: z.lazy(() => RoomEquipmentCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => RoomEquipmentMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => RoomEquipmentMinOrderByAggregateInputObjectSchema).optional()
}).strict();
