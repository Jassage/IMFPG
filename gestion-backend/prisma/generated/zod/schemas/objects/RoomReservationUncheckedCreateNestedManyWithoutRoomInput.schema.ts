import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomReservationCreateWithoutRoomInputObjectSchema } from './RoomReservationCreateWithoutRoomInput.schema';
import { RoomReservationUncheckedCreateWithoutRoomInputObjectSchema } from './RoomReservationUncheckedCreateWithoutRoomInput.schema';
import { RoomReservationCreateOrConnectWithoutRoomInputObjectSchema } from './RoomReservationCreateOrConnectWithoutRoomInput.schema';
import { RoomReservationCreateManyRoomInputEnvelopeObjectSchema } from './RoomReservationCreateManyRoomInputEnvelope.schema';
import { RoomReservationWhereUniqueInputObjectSchema } from './RoomReservationWhereUniqueInput.schema'

export const RoomReservationUncheckedCreateNestedManyWithoutRoomInputObjectSchema: z.ZodType<Prisma.RoomReservationUncheckedCreateNestedManyWithoutRoomInput, z.ZodTypeDef, Prisma.RoomReservationUncheckedCreateNestedManyWithoutRoomInput> = z.object({
  create: z.union([z.lazy(() => RoomReservationCreateWithoutRoomInputObjectSchema), z.lazy(() => RoomReservationCreateWithoutRoomInputObjectSchema).array(), z.lazy(() => RoomReservationUncheckedCreateWithoutRoomInputObjectSchema), z.lazy(() => RoomReservationUncheckedCreateWithoutRoomInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => RoomReservationCreateOrConnectWithoutRoomInputObjectSchema), z.lazy(() => RoomReservationCreateOrConnectWithoutRoomInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => RoomReservationCreateManyRoomInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => RoomReservationWhereUniqueInputObjectSchema), z.lazy(() => RoomReservationWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const RoomReservationUncheckedCreateNestedManyWithoutRoomInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => RoomReservationCreateWithoutRoomInputObjectSchema), z.lazy(() => RoomReservationCreateWithoutRoomInputObjectSchema).array(), z.lazy(() => RoomReservationUncheckedCreateWithoutRoomInputObjectSchema), z.lazy(() => RoomReservationUncheckedCreateWithoutRoomInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => RoomReservationCreateOrConnectWithoutRoomInputObjectSchema), z.lazy(() => RoomReservationCreateOrConnectWithoutRoomInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => RoomReservationCreateManyRoomInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => RoomReservationWhereUniqueInputObjectSchema), z.lazy(() => RoomReservationWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
