import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomEquipmentWhereUniqueInputObjectSchema } from './RoomEquipmentWhereUniqueInput.schema';
import { RoomEquipmentCreateWithoutRoomInputObjectSchema } from './RoomEquipmentCreateWithoutRoomInput.schema';
import { RoomEquipmentUncheckedCreateWithoutRoomInputObjectSchema } from './RoomEquipmentUncheckedCreateWithoutRoomInput.schema'

export const RoomEquipmentCreateOrConnectWithoutRoomInputObjectSchema: z.ZodType<Prisma.RoomEquipmentCreateOrConnectWithoutRoomInput, z.ZodTypeDef, Prisma.RoomEquipmentCreateOrConnectWithoutRoomInput> = z.object({
  where: z.lazy(() => RoomEquipmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => RoomEquipmentCreateWithoutRoomInputObjectSchema), z.lazy(() => RoomEquipmentUncheckedCreateWithoutRoomInputObjectSchema)])
}).strict();
export const RoomEquipmentCreateOrConnectWithoutRoomInputObjectZodSchema = z.object({
  where: z.lazy(() => RoomEquipmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => RoomEquipmentCreateWithoutRoomInputObjectSchema), z.lazy(() => RoomEquipmentUncheckedCreateWithoutRoomInputObjectSchema)])
}).strict();
