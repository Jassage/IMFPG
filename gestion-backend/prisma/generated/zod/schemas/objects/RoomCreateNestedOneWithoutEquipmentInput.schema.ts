import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomCreateWithoutEquipmentInputObjectSchema } from './RoomCreateWithoutEquipmentInput.schema';
import { RoomUncheckedCreateWithoutEquipmentInputObjectSchema } from './RoomUncheckedCreateWithoutEquipmentInput.schema';
import { RoomCreateOrConnectWithoutEquipmentInputObjectSchema } from './RoomCreateOrConnectWithoutEquipmentInput.schema';
import { RoomWhereUniqueInputObjectSchema } from './RoomWhereUniqueInput.schema'

export const RoomCreateNestedOneWithoutEquipmentInputObjectSchema: z.ZodType<Prisma.RoomCreateNestedOneWithoutEquipmentInput, z.ZodTypeDef, Prisma.RoomCreateNestedOneWithoutEquipmentInput> = z.object({
  create: z.union([z.lazy(() => RoomCreateWithoutEquipmentInputObjectSchema), z.lazy(() => RoomUncheckedCreateWithoutEquipmentInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => RoomCreateOrConnectWithoutEquipmentInputObjectSchema).optional(),
  connect: z.lazy(() => RoomWhereUniqueInputObjectSchema).optional()
}).strict();
export const RoomCreateNestedOneWithoutEquipmentInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => RoomCreateWithoutEquipmentInputObjectSchema), z.lazy(() => RoomUncheckedCreateWithoutEquipmentInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => RoomCreateOrConnectWithoutEquipmentInputObjectSchema).optional(),
  connect: z.lazy(() => RoomWhereUniqueInputObjectSchema).optional()
}).strict();
