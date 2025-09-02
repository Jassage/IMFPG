import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomReservationCreateManyRoomInputObjectSchema } from './RoomReservationCreateManyRoomInput.schema'

export const RoomReservationCreateManyRoomInputEnvelopeObjectSchema: z.ZodType<Prisma.RoomReservationCreateManyRoomInputEnvelope, z.ZodTypeDef, Prisma.RoomReservationCreateManyRoomInputEnvelope> = z.object({
  data: z.union([z.lazy(() => RoomReservationCreateManyRoomInputObjectSchema), z.lazy(() => RoomReservationCreateManyRoomInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const RoomReservationCreateManyRoomInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => RoomReservationCreateManyRoomInputObjectSchema), z.lazy(() => RoomReservationCreateManyRoomInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
