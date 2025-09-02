import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomWhereInputObjectSchema } from './RoomWhereInput.schema';
import { RoomUpdateWithoutEquipmentInputObjectSchema } from './RoomUpdateWithoutEquipmentInput.schema';
import { RoomUncheckedUpdateWithoutEquipmentInputObjectSchema } from './RoomUncheckedUpdateWithoutEquipmentInput.schema'

export const RoomUpdateToOneWithWhereWithoutEquipmentInputObjectSchema: z.ZodType<Prisma.RoomUpdateToOneWithWhereWithoutEquipmentInput, z.ZodTypeDef, Prisma.RoomUpdateToOneWithWhereWithoutEquipmentInput> = z.object({
  where: z.lazy(() => RoomWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => RoomUpdateWithoutEquipmentInputObjectSchema), z.lazy(() => RoomUncheckedUpdateWithoutEquipmentInputObjectSchema)])
}).strict();
export const RoomUpdateToOneWithWhereWithoutEquipmentInputObjectZodSchema = z.object({
  where: z.lazy(() => RoomWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => RoomUpdateWithoutEquipmentInputObjectSchema), z.lazy(() => RoomUncheckedUpdateWithoutEquipmentInputObjectSchema)])
}).strict();
