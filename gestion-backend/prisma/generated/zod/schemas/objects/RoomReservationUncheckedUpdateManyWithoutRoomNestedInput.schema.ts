import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomReservationCreateWithoutRoomInputObjectSchema } from './RoomReservationCreateWithoutRoomInput.schema';
import { RoomReservationUncheckedCreateWithoutRoomInputObjectSchema } from './RoomReservationUncheckedCreateWithoutRoomInput.schema';
import { RoomReservationCreateOrConnectWithoutRoomInputObjectSchema } from './RoomReservationCreateOrConnectWithoutRoomInput.schema';
import { RoomReservationUpsertWithWhereUniqueWithoutRoomInputObjectSchema } from './RoomReservationUpsertWithWhereUniqueWithoutRoomInput.schema';
import { RoomReservationCreateManyRoomInputEnvelopeObjectSchema } from './RoomReservationCreateManyRoomInputEnvelope.schema';
import { RoomReservationWhereUniqueInputObjectSchema } from './RoomReservationWhereUniqueInput.schema';
import { RoomReservationUpdateWithWhereUniqueWithoutRoomInputObjectSchema } from './RoomReservationUpdateWithWhereUniqueWithoutRoomInput.schema';
import { RoomReservationUpdateManyWithWhereWithoutRoomInputObjectSchema } from './RoomReservationUpdateManyWithWhereWithoutRoomInput.schema';
import { RoomReservationScalarWhereInputObjectSchema } from './RoomReservationScalarWhereInput.schema'

export const RoomReservationUncheckedUpdateManyWithoutRoomNestedInputObjectSchema: z.ZodType<Prisma.RoomReservationUncheckedUpdateManyWithoutRoomNestedInput, z.ZodTypeDef, Prisma.RoomReservationUncheckedUpdateManyWithoutRoomNestedInput> = z.object({
  create: z.union([z.lazy(() => RoomReservationCreateWithoutRoomInputObjectSchema), z.lazy(() => RoomReservationCreateWithoutRoomInputObjectSchema).array(), z.lazy(() => RoomReservationUncheckedCreateWithoutRoomInputObjectSchema), z.lazy(() => RoomReservationUncheckedCreateWithoutRoomInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => RoomReservationCreateOrConnectWithoutRoomInputObjectSchema), z.lazy(() => RoomReservationCreateOrConnectWithoutRoomInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => RoomReservationUpsertWithWhereUniqueWithoutRoomInputObjectSchema), z.lazy(() => RoomReservationUpsertWithWhereUniqueWithoutRoomInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => RoomReservationCreateManyRoomInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => RoomReservationWhereUniqueInputObjectSchema), z.lazy(() => RoomReservationWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => RoomReservationWhereUniqueInputObjectSchema), z.lazy(() => RoomReservationWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => RoomReservationWhereUniqueInputObjectSchema), z.lazy(() => RoomReservationWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => RoomReservationWhereUniqueInputObjectSchema), z.lazy(() => RoomReservationWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => RoomReservationUpdateWithWhereUniqueWithoutRoomInputObjectSchema), z.lazy(() => RoomReservationUpdateWithWhereUniqueWithoutRoomInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => RoomReservationUpdateManyWithWhereWithoutRoomInputObjectSchema), z.lazy(() => RoomReservationUpdateManyWithWhereWithoutRoomInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => RoomReservationScalarWhereInputObjectSchema), z.lazy(() => RoomReservationScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const RoomReservationUncheckedUpdateManyWithoutRoomNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => RoomReservationCreateWithoutRoomInputObjectSchema), z.lazy(() => RoomReservationCreateWithoutRoomInputObjectSchema).array(), z.lazy(() => RoomReservationUncheckedCreateWithoutRoomInputObjectSchema), z.lazy(() => RoomReservationUncheckedCreateWithoutRoomInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => RoomReservationCreateOrConnectWithoutRoomInputObjectSchema), z.lazy(() => RoomReservationCreateOrConnectWithoutRoomInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => RoomReservationUpsertWithWhereUniqueWithoutRoomInputObjectSchema), z.lazy(() => RoomReservationUpsertWithWhereUniqueWithoutRoomInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => RoomReservationCreateManyRoomInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => RoomReservationWhereUniqueInputObjectSchema), z.lazy(() => RoomReservationWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => RoomReservationWhereUniqueInputObjectSchema), z.lazy(() => RoomReservationWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => RoomReservationWhereUniqueInputObjectSchema), z.lazy(() => RoomReservationWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => RoomReservationWhereUniqueInputObjectSchema), z.lazy(() => RoomReservationWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => RoomReservationUpdateWithWhereUniqueWithoutRoomInputObjectSchema), z.lazy(() => RoomReservationUpdateWithWhereUniqueWithoutRoomInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => RoomReservationUpdateManyWithWhereWithoutRoomInputObjectSchema), z.lazy(() => RoomReservationUpdateManyWithWhereWithoutRoomInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => RoomReservationScalarWhereInputObjectSchema), z.lazy(() => RoomReservationScalarWhereInputObjectSchema).array()]).optional()
}).strict();
