import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomUpdateWithoutEquipmentInputObjectSchema } from './RoomUpdateWithoutEquipmentInput.schema';
import { RoomUncheckedUpdateWithoutEquipmentInputObjectSchema } from './RoomUncheckedUpdateWithoutEquipmentInput.schema';
import { RoomCreateWithoutEquipmentInputObjectSchema } from './RoomCreateWithoutEquipmentInput.schema';
import { RoomUncheckedCreateWithoutEquipmentInputObjectSchema } from './RoomUncheckedCreateWithoutEquipmentInput.schema';
import { RoomWhereInputObjectSchema } from './RoomWhereInput.schema'

export const RoomUpsertWithoutEquipmentInputObjectSchema: z.ZodType<Prisma.RoomUpsertWithoutEquipmentInput, z.ZodTypeDef, Prisma.RoomUpsertWithoutEquipmentInput> = z.object({
  update: z.union([z.lazy(() => RoomUpdateWithoutEquipmentInputObjectSchema), z.lazy(() => RoomUncheckedUpdateWithoutEquipmentInputObjectSchema)]),
  create: z.union([z.lazy(() => RoomCreateWithoutEquipmentInputObjectSchema), z.lazy(() => RoomUncheckedCreateWithoutEquipmentInputObjectSchema)]),
  where: z.lazy(() => RoomWhereInputObjectSchema).optional()
}).strict();
export const RoomUpsertWithoutEquipmentInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => RoomUpdateWithoutEquipmentInputObjectSchema), z.lazy(() => RoomUncheckedUpdateWithoutEquipmentInputObjectSchema)]),
  create: z.union([z.lazy(() => RoomCreateWithoutEquipmentInputObjectSchema), z.lazy(() => RoomUncheckedCreateWithoutEquipmentInputObjectSchema)]),
  where: z.lazy(() => RoomWhereInputObjectSchema).optional()
}).strict();
