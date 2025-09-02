import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { RoomEquipmentOrderByRelationAggregateInputObjectSchema } from './RoomEquipmentOrderByRelationAggregateInput.schema';
import { RoomReservationOrderByRelationAggregateInputObjectSchema } from './RoomReservationOrderByRelationAggregateInput.schema';
import { RoomOrderByRelevanceInputObjectSchema } from './RoomOrderByRelevanceInput.schema'

export const RoomOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.RoomOrderByWithRelationInput, z.ZodTypeDef, Prisma.RoomOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  capacity: SortOrderSchema.optional(),
  location: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  equipment: z.lazy(() => RoomEquipmentOrderByRelationAggregateInputObjectSchema).optional(),
  reservations: z.lazy(() => RoomReservationOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => RoomOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const RoomOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  capacity: SortOrderSchema.optional(),
  location: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  equipment: z.lazy(() => RoomEquipmentOrderByRelationAggregateInputObjectSchema).optional(),
  reservations: z.lazy(() => RoomReservationOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => RoomOrderByRelevanceInputObjectSchema).optional()
}).strict();
