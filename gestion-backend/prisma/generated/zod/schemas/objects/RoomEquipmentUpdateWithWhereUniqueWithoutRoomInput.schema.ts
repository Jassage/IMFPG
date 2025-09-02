import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomEquipmentWhereUniqueInputObjectSchema } from './RoomEquipmentWhereUniqueInput.schema';
import { RoomEquipmentUpdateWithoutRoomInputObjectSchema } from './RoomEquipmentUpdateWithoutRoomInput.schema';
import { RoomEquipmentUncheckedUpdateWithoutRoomInputObjectSchema } from './RoomEquipmentUncheckedUpdateWithoutRoomInput.schema'

export const RoomEquipmentUpdateWithWhereUniqueWithoutRoomInputObjectSchema: z.ZodType<Prisma.RoomEquipmentUpdateWithWhereUniqueWithoutRoomInput, z.ZodTypeDef, Prisma.RoomEquipmentUpdateWithWhereUniqueWithoutRoomInput> = z.object({
  where: z.lazy(() => RoomEquipmentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => RoomEquipmentUpdateWithoutRoomInputObjectSchema), z.lazy(() => RoomEquipmentUncheckedUpdateWithoutRoomInputObjectSchema)])
}).strict();
export const RoomEquipmentUpdateWithWhereUniqueWithoutRoomInputObjectZodSchema = z.object({
  where: z.lazy(() => RoomEquipmentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => RoomEquipmentUpdateWithoutRoomInputObjectSchema), z.lazy(() => RoomEquipmentUncheckedUpdateWithoutRoomInputObjectSchema)])
}).strict();
