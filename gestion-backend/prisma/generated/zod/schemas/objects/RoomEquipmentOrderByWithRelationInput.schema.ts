import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { RoomOrderByWithRelationInputObjectSchema } from './RoomOrderByWithRelationInput.schema';
import { RoomEquipmentOrderByRelevanceInputObjectSchema } from './RoomEquipmentOrderByRelevanceInput.schema'

export const RoomEquipmentOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.RoomEquipmentOrderByWithRelationInput, z.ZodTypeDef, Prisma.RoomEquipmentOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  roomId: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  room: z.lazy(() => RoomOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => RoomEquipmentOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const RoomEquipmentOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  roomId: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  room: z.lazy(() => RoomOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => RoomEquipmentOrderByRelevanceInputObjectSchema).optional()
}).strict();
