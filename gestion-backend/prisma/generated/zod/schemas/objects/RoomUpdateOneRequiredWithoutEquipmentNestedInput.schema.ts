import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomCreateWithoutEquipmentInputObjectSchema } from './RoomCreateWithoutEquipmentInput.schema';
import { RoomUncheckedCreateWithoutEquipmentInputObjectSchema } from './RoomUncheckedCreateWithoutEquipmentInput.schema';
import { RoomCreateOrConnectWithoutEquipmentInputObjectSchema } from './RoomCreateOrConnectWithoutEquipmentInput.schema';
import { RoomUpsertWithoutEquipmentInputObjectSchema } from './RoomUpsertWithoutEquipmentInput.schema';
import { RoomWhereUniqueInputObjectSchema } from './RoomWhereUniqueInput.schema';
import { RoomUpdateToOneWithWhereWithoutEquipmentInputObjectSchema } from './RoomUpdateToOneWithWhereWithoutEquipmentInput.schema';
import { RoomUpdateWithoutEquipmentInputObjectSchema } from './RoomUpdateWithoutEquipmentInput.schema';
import { RoomUncheckedUpdateWithoutEquipmentInputObjectSchema } from './RoomUncheckedUpdateWithoutEquipmentInput.schema'

export const RoomUpdateOneRequiredWithoutEquipmentNestedInputObjectSchema: z.ZodType<Prisma.RoomUpdateOneRequiredWithoutEquipmentNestedInput, z.ZodTypeDef, Prisma.RoomUpdateOneRequiredWithoutEquipmentNestedInput> = z.object({
  create: z.union([z.lazy(() => RoomCreateWithoutEquipmentInputObjectSchema), z.lazy(() => RoomUncheckedCreateWithoutEquipmentInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => RoomCreateOrConnectWithoutEquipmentInputObjectSchema).optional(),
  upsert: z.lazy(() => RoomUpsertWithoutEquipmentInputObjectSchema).optional(),
  connect: z.lazy(() => RoomWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => RoomUpdateToOneWithWhereWithoutEquipmentInputObjectSchema), z.lazy(() => RoomUpdateWithoutEquipmentInputObjectSchema), z.lazy(() => RoomUncheckedUpdateWithoutEquipmentInputObjectSchema)]).optional()
}).strict();
export const RoomUpdateOneRequiredWithoutEquipmentNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => RoomCreateWithoutEquipmentInputObjectSchema), z.lazy(() => RoomUncheckedCreateWithoutEquipmentInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => RoomCreateOrConnectWithoutEquipmentInputObjectSchema).optional(),
  upsert: z.lazy(() => RoomUpsertWithoutEquipmentInputObjectSchema).optional(),
  connect: z.lazy(() => RoomWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => RoomUpdateToOneWithWhereWithoutEquipmentInputObjectSchema), z.lazy(() => RoomUpdateWithoutEquipmentInputObjectSchema), z.lazy(() => RoomUncheckedUpdateWithoutEquipmentInputObjectSchema)]).optional()
}).strict();
