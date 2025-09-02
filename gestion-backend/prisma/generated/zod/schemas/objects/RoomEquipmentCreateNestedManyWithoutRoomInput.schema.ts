import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomEquipmentCreateWithoutRoomInputObjectSchema } from './RoomEquipmentCreateWithoutRoomInput.schema';
import { RoomEquipmentUncheckedCreateWithoutRoomInputObjectSchema } from './RoomEquipmentUncheckedCreateWithoutRoomInput.schema';
import { RoomEquipmentCreateOrConnectWithoutRoomInputObjectSchema } from './RoomEquipmentCreateOrConnectWithoutRoomInput.schema';
import { RoomEquipmentCreateManyRoomInputEnvelopeObjectSchema } from './RoomEquipmentCreateManyRoomInputEnvelope.schema';
import { RoomEquipmentWhereUniqueInputObjectSchema } from './RoomEquipmentWhereUniqueInput.schema'

export const RoomEquipmentCreateNestedManyWithoutRoomInputObjectSchema: z.ZodType<Prisma.RoomEquipmentCreateNestedManyWithoutRoomInput, z.ZodTypeDef, Prisma.RoomEquipmentCreateNestedManyWithoutRoomInput> = z.object({
  create: z.union([z.lazy(() => RoomEquipmentCreateWithoutRoomInputObjectSchema), z.lazy(() => RoomEquipmentCreateWithoutRoomInputObjectSchema).array(), z.lazy(() => RoomEquipmentUncheckedCreateWithoutRoomInputObjectSchema), z.lazy(() => RoomEquipmentUncheckedCreateWithoutRoomInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => RoomEquipmentCreateOrConnectWithoutRoomInputObjectSchema), z.lazy(() => RoomEquipmentCreateOrConnectWithoutRoomInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => RoomEquipmentCreateManyRoomInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => RoomEquipmentWhereUniqueInputObjectSchema), z.lazy(() => RoomEquipmentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const RoomEquipmentCreateNestedManyWithoutRoomInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => RoomEquipmentCreateWithoutRoomInputObjectSchema), z.lazy(() => RoomEquipmentCreateWithoutRoomInputObjectSchema).array(), z.lazy(() => RoomEquipmentUncheckedCreateWithoutRoomInputObjectSchema), z.lazy(() => RoomEquipmentUncheckedCreateWithoutRoomInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => RoomEquipmentCreateOrConnectWithoutRoomInputObjectSchema), z.lazy(() => RoomEquipmentCreateOrConnectWithoutRoomInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => RoomEquipmentCreateManyRoomInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => RoomEquipmentWhereUniqueInputObjectSchema), z.lazy(() => RoomEquipmentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
