import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomEquipmentCreateWithoutRoomInputObjectSchema } from './RoomEquipmentCreateWithoutRoomInput.schema';
import { RoomEquipmentUncheckedCreateWithoutRoomInputObjectSchema } from './RoomEquipmentUncheckedCreateWithoutRoomInput.schema';
import { RoomEquipmentCreateOrConnectWithoutRoomInputObjectSchema } from './RoomEquipmentCreateOrConnectWithoutRoomInput.schema';
import { RoomEquipmentUpsertWithWhereUniqueWithoutRoomInputObjectSchema } from './RoomEquipmentUpsertWithWhereUniqueWithoutRoomInput.schema';
import { RoomEquipmentCreateManyRoomInputEnvelopeObjectSchema } from './RoomEquipmentCreateManyRoomInputEnvelope.schema';
import { RoomEquipmentWhereUniqueInputObjectSchema } from './RoomEquipmentWhereUniqueInput.schema';
import { RoomEquipmentUpdateWithWhereUniqueWithoutRoomInputObjectSchema } from './RoomEquipmentUpdateWithWhereUniqueWithoutRoomInput.schema';
import { RoomEquipmentUpdateManyWithWhereWithoutRoomInputObjectSchema } from './RoomEquipmentUpdateManyWithWhereWithoutRoomInput.schema';
import { RoomEquipmentScalarWhereInputObjectSchema } from './RoomEquipmentScalarWhereInput.schema'

export const RoomEquipmentUncheckedUpdateManyWithoutRoomNestedInputObjectSchema: z.ZodType<Prisma.RoomEquipmentUncheckedUpdateManyWithoutRoomNestedInput, z.ZodTypeDef, Prisma.RoomEquipmentUncheckedUpdateManyWithoutRoomNestedInput> = z.object({
  create: z.union([z.lazy(() => RoomEquipmentCreateWithoutRoomInputObjectSchema), z.lazy(() => RoomEquipmentCreateWithoutRoomInputObjectSchema).array(), z.lazy(() => RoomEquipmentUncheckedCreateWithoutRoomInputObjectSchema), z.lazy(() => RoomEquipmentUncheckedCreateWithoutRoomInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => RoomEquipmentCreateOrConnectWithoutRoomInputObjectSchema), z.lazy(() => RoomEquipmentCreateOrConnectWithoutRoomInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => RoomEquipmentUpsertWithWhereUniqueWithoutRoomInputObjectSchema), z.lazy(() => RoomEquipmentUpsertWithWhereUniqueWithoutRoomInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => RoomEquipmentCreateManyRoomInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => RoomEquipmentWhereUniqueInputObjectSchema), z.lazy(() => RoomEquipmentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => RoomEquipmentWhereUniqueInputObjectSchema), z.lazy(() => RoomEquipmentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => RoomEquipmentWhereUniqueInputObjectSchema), z.lazy(() => RoomEquipmentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => RoomEquipmentWhereUniqueInputObjectSchema), z.lazy(() => RoomEquipmentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => RoomEquipmentUpdateWithWhereUniqueWithoutRoomInputObjectSchema), z.lazy(() => RoomEquipmentUpdateWithWhereUniqueWithoutRoomInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => RoomEquipmentUpdateManyWithWhereWithoutRoomInputObjectSchema), z.lazy(() => RoomEquipmentUpdateManyWithWhereWithoutRoomInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => RoomEquipmentScalarWhereInputObjectSchema), z.lazy(() => RoomEquipmentScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const RoomEquipmentUncheckedUpdateManyWithoutRoomNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => RoomEquipmentCreateWithoutRoomInputObjectSchema), z.lazy(() => RoomEquipmentCreateWithoutRoomInputObjectSchema).array(), z.lazy(() => RoomEquipmentUncheckedCreateWithoutRoomInputObjectSchema), z.lazy(() => RoomEquipmentUncheckedCreateWithoutRoomInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => RoomEquipmentCreateOrConnectWithoutRoomInputObjectSchema), z.lazy(() => RoomEquipmentCreateOrConnectWithoutRoomInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => RoomEquipmentUpsertWithWhereUniqueWithoutRoomInputObjectSchema), z.lazy(() => RoomEquipmentUpsertWithWhereUniqueWithoutRoomInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => RoomEquipmentCreateManyRoomInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => RoomEquipmentWhereUniqueInputObjectSchema), z.lazy(() => RoomEquipmentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => RoomEquipmentWhereUniqueInputObjectSchema), z.lazy(() => RoomEquipmentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => RoomEquipmentWhereUniqueInputObjectSchema), z.lazy(() => RoomEquipmentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => RoomEquipmentWhereUniqueInputObjectSchema), z.lazy(() => RoomEquipmentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => RoomEquipmentUpdateWithWhereUniqueWithoutRoomInputObjectSchema), z.lazy(() => RoomEquipmentUpdateWithWhereUniqueWithoutRoomInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => RoomEquipmentUpdateManyWithWhereWithoutRoomInputObjectSchema), z.lazy(() => RoomEquipmentUpdateManyWithWhereWithoutRoomInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => RoomEquipmentScalarWhereInputObjectSchema), z.lazy(() => RoomEquipmentScalarWhereInputObjectSchema).array()]).optional()
}).strict();
