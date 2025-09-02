import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomWhereUniqueInputObjectSchema } from './RoomWhereUniqueInput.schema';
import { RoomCreateWithoutEquipmentInputObjectSchema } from './RoomCreateWithoutEquipmentInput.schema';
import { RoomUncheckedCreateWithoutEquipmentInputObjectSchema } from './RoomUncheckedCreateWithoutEquipmentInput.schema'

export const RoomCreateOrConnectWithoutEquipmentInputObjectSchema: z.ZodType<Prisma.RoomCreateOrConnectWithoutEquipmentInput, z.ZodTypeDef, Prisma.RoomCreateOrConnectWithoutEquipmentInput> = z.object({
  where: z.lazy(() => RoomWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => RoomCreateWithoutEquipmentInputObjectSchema), z.lazy(() => RoomUncheckedCreateWithoutEquipmentInputObjectSchema)])
}).strict();
export const RoomCreateOrConnectWithoutEquipmentInputObjectZodSchema = z.object({
  where: z.lazy(() => RoomWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => RoomCreateWithoutEquipmentInputObjectSchema), z.lazy(() => RoomUncheckedCreateWithoutEquipmentInputObjectSchema)])
}).strict();
