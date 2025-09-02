import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomReservationScalarWhereInputObjectSchema } from './RoomReservationScalarWhereInput.schema';
import { RoomReservationUpdateManyMutationInputObjectSchema } from './RoomReservationUpdateManyMutationInput.schema';
import { RoomReservationUncheckedUpdateManyWithoutRoomInputObjectSchema } from './RoomReservationUncheckedUpdateManyWithoutRoomInput.schema'

export const RoomReservationUpdateManyWithWhereWithoutRoomInputObjectSchema: z.ZodType<Prisma.RoomReservationUpdateManyWithWhereWithoutRoomInput, z.ZodTypeDef, Prisma.RoomReservationUpdateManyWithWhereWithoutRoomInput> = z.object({
  where: z.lazy(() => RoomReservationScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => RoomReservationUpdateManyMutationInputObjectSchema), z.lazy(() => RoomReservationUncheckedUpdateManyWithoutRoomInputObjectSchema)])
}).strict();
export const RoomReservationUpdateManyWithWhereWithoutRoomInputObjectZodSchema = z.object({
  where: z.lazy(() => RoomReservationScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => RoomReservationUpdateManyMutationInputObjectSchema), z.lazy(() => RoomReservationUncheckedUpdateManyWithoutRoomInputObjectSchema)])
}).strict();
