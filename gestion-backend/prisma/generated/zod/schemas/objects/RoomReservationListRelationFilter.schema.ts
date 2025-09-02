import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomReservationWhereInputObjectSchema } from './RoomReservationWhereInput.schema'

export const RoomReservationListRelationFilterObjectSchema: z.ZodType<Prisma.RoomReservationListRelationFilter, z.ZodTypeDef, Prisma.RoomReservationListRelationFilter> = z.object({
  every: z.lazy(() => RoomReservationWhereInputObjectSchema).optional(),
  some: z.lazy(() => RoomReservationWhereInputObjectSchema).optional(),
  none: z.lazy(() => RoomReservationWhereInputObjectSchema).optional()
}).strict();
export const RoomReservationListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => RoomReservationWhereInputObjectSchema).optional(),
  some: z.lazy(() => RoomReservationWhereInputObjectSchema).optional(),
  none: z.lazy(() => RoomReservationWhereInputObjectSchema).optional()
}).strict();
