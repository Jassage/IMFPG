import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomReservationWhereUniqueInputObjectSchema } from './RoomReservationWhereUniqueInput.schema';
import { RoomReservationUpdateWithoutRoomInputObjectSchema } from './RoomReservationUpdateWithoutRoomInput.schema';
import { RoomReservationUncheckedUpdateWithoutRoomInputObjectSchema } from './RoomReservationUncheckedUpdateWithoutRoomInput.schema'

export const RoomReservationUpdateWithWhereUniqueWithoutRoomInputObjectSchema: z.ZodType<Prisma.RoomReservationUpdateWithWhereUniqueWithoutRoomInput, z.ZodTypeDef, Prisma.RoomReservationUpdateWithWhereUniqueWithoutRoomInput> = z.object({
  where: z.lazy(() => RoomReservationWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => RoomReservationUpdateWithoutRoomInputObjectSchema), z.lazy(() => RoomReservationUncheckedUpdateWithoutRoomInputObjectSchema)])
}).strict();
export const RoomReservationUpdateWithWhereUniqueWithoutRoomInputObjectZodSchema = z.object({
  where: z.lazy(() => RoomReservationWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => RoomReservationUpdateWithoutRoomInputObjectSchema), z.lazy(() => RoomReservationUncheckedUpdateWithoutRoomInputObjectSchema)])
}).strict();
