import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomReservationWhereUniqueInputObjectSchema } from './RoomReservationWhereUniqueInput.schema';
import { RoomReservationUpdateWithoutRoomInputObjectSchema } from './RoomReservationUpdateWithoutRoomInput.schema';
import { RoomReservationUncheckedUpdateWithoutRoomInputObjectSchema } from './RoomReservationUncheckedUpdateWithoutRoomInput.schema';
import { RoomReservationCreateWithoutRoomInputObjectSchema } from './RoomReservationCreateWithoutRoomInput.schema';
import { RoomReservationUncheckedCreateWithoutRoomInputObjectSchema } from './RoomReservationUncheckedCreateWithoutRoomInput.schema'

export const RoomReservationUpsertWithWhereUniqueWithoutRoomInputObjectSchema: z.ZodType<Prisma.RoomReservationUpsertWithWhereUniqueWithoutRoomInput, z.ZodTypeDef, Prisma.RoomReservationUpsertWithWhereUniqueWithoutRoomInput> = z.object({
  where: z.lazy(() => RoomReservationWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => RoomReservationUpdateWithoutRoomInputObjectSchema), z.lazy(() => RoomReservationUncheckedUpdateWithoutRoomInputObjectSchema)]),
  create: z.union([z.lazy(() => RoomReservationCreateWithoutRoomInputObjectSchema), z.lazy(() => RoomReservationUncheckedCreateWithoutRoomInputObjectSchema)])
}).strict();
export const RoomReservationUpsertWithWhereUniqueWithoutRoomInputObjectZodSchema = z.object({
  where: z.lazy(() => RoomReservationWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => RoomReservationUpdateWithoutRoomInputObjectSchema), z.lazy(() => RoomReservationUncheckedUpdateWithoutRoomInputObjectSchema)]),
  create: z.union([z.lazy(() => RoomReservationCreateWithoutRoomInputObjectSchema), z.lazy(() => RoomReservationUncheckedCreateWithoutRoomInputObjectSchema)])
}).strict();
