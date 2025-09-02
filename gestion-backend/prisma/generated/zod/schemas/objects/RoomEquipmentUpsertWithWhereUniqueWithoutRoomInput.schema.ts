import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomEquipmentWhereUniqueInputObjectSchema } from './RoomEquipmentWhereUniqueInput.schema';
import { RoomEquipmentUpdateWithoutRoomInputObjectSchema } from './RoomEquipmentUpdateWithoutRoomInput.schema';
import { RoomEquipmentUncheckedUpdateWithoutRoomInputObjectSchema } from './RoomEquipmentUncheckedUpdateWithoutRoomInput.schema';
import { RoomEquipmentCreateWithoutRoomInputObjectSchema } from './RoomEquipmentCreateWithoutRoomInput.schema';
import { RoomEquipmentUncheckedCreateWithoutRoomInputObjectSchema } from './RoomEquipmentUncheckedCreateWithoutRoomInput.schema'

export const RoomEquipmentUpsertWithWhereUniqueWithoutRoomInputObjectSchema: z.ZodType<Prisma.RoomEquipmentUpsertWithWhereUniqueWithoutRoomInput, z.ZodTypeDef, Prisma.RoomEquipmentUpsertWithWhereUniqueWithoutRoomInput> = z.object({
  where: z.lazy(() => RoomEquipmentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => RoomEquipmentUpdateWithoutRoomInputObjectSchema), z.lazy(() => RoomEquipmentUncheckedUpdateWithoutRoomInputObjectSchema)]),
  create: z.union([z.lazy(() => RoomEquipmentCreateWithoutRoomInputObjectSchema), z.lazy(() => RoomEquipmentUncheckedCreateWithoutRoomInputObjectSchema)])
}).strict();
export const RoomEquipmentUpsertWithWhereUniqueWithoutRoomInputObjectZodSchema = z.object({
  where: z.lazy(() => RoomEquipmentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => RoomEquipmentUpdateWithoutRoomInputObjectSchema), z.lazy(() => RoomEquipmentUncheckedUpdateWithoutRoomInputObjectSchema)]),
  create: z.union([z.lazy(() => RoomEquipmentCreateWithoutRoomInputObjectSchema), z.lazy(() => RoomEquipmentUncheckedCreateWithoutRoomInputObjectSchema)])
}).strict();
