import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { RoomOrderByWithRelationInputObjectSchema } from './RoomOrderByWithRelationInput.schema';
import { RoomReservationOrderByRelevanceInputObjectSchema } from './RoomReservationOrderByRelevanceInput.schema'

export const RoomReservationOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.RoomReservationOrderByWithRelationInput, z.ZodTypeDef, Prisma.RoomReservationOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  roomId: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  startTime: SortOrderSchema.optional(),
  endTime: SortOrderSchema.optional(),
  purpose: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  room: z.lazy(() => RoomOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => RoomReservationOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const RoomReservationOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  roomId: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  startTime: SortOrderSchema.optional(),
  endTime: SortOrderSchema.optional(),
  purpose: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  room: z.lazy(() => RoomOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => RoomReservationOrderByRelevanceInputObjectSchema).optional()
}).strict();
