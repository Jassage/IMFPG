import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomReservationWhereUniqueInputObjectSchema } from './RoomReservationWhereUniqueInput.schema';
import { RoomReservationCreateWithoutRoomInputObjectSchema } from './RoomReservationCreateWithoutRoomInput.schema';
import { RoomReservationUncheckedCreateWithoutRoomInputObjectSchema } from './RoomReservationUncheckedCreateWithoutRoomInput.schema'

export const RoomReservationCreateOrConnectWithoutRoomInputObjectSchema: z.ZodType<Prisma.RoomReservationCreateOrConnectWithoutRoomInput, z.ZodTypeDef, Prisma.RoomReservationCreateOrConnectWithoutRoomInput> = z.object({
  where: z.lazy(() => RoomReservationWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => RoomReservationCreateWithoutRoomInputObjectSchema), z.lazy(() => RoomReservationUncheckedCreateWithoutRoomInputObjectSchema)])
}).strict();
export const RoomReservationCreateOrConnectWithoutRoomInputObjectZodSchema = z.object({
  where: z.lazy(() => RoomReservationWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => RoomReservationCreateWithoutRoomInputObjectSchema), z.lazy(() => RoomReservationUncheckedCreateWithoutRoomInputObjectSchema)])
}).strict();
