import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomEquipmentScalarWhereInputObjectSchema } from './RoomEquipmentScalarWhereInput.schema';
import { RoomEquipmentUpdateManyMutationInputObjectSchema } from './RoomEquipmentUpdateManyMutationInput.schema';
import { RoomEquipmentUncheckedUpdateManyWithoutRoomInputObjectSchema } from './RoomEquipmentUncheckedUpdateManyWithoutRoomInput.schema'

export const RoomEquipmentUpdateManyWithWhereWithoutRoomInputObjectSchema: z.ZodType<Prisma.RoomEquipmentUpdateManyWithWhereWithoutRoomInput, z.ZodTypeDef, Prisma.RoomEquipmentUpdateManyWithWhereWithoutRoomInput> = z.object({
  where: z.lazy(() => RoomEquipmentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => RoomEquipmentUpdateManyMutationInputObjectSchema), z.lazy(() => RoomEquipmentUncheckedUpdateManyWithoutRoomInputObjectSchema)])
}).strict();
export const RoomEquipmentUpdateManyWithWhereWithoutRoomInputObjectZodSchema = z.object({
  where: z.lazy(() => RoomEquipmentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => RoomEquipmentUpdateManyMutationInputObjectSchema), z.lazy(() => RoomEquipmentUncheckedUpdateManyWithoutRoomInputObjectSchema)])
}).strict();
