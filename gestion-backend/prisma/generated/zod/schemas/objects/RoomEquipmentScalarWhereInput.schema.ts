import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema'

export const RoomEquipmentScalarWhereInputObjectSchema: z.ZodType<Prisma.RoomEquipmentScalarWhereInput, z.ZodTypeDef, Prisma.RoomEquipmentScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => RoomEquipmentScalarWhereInputObjectSchema), z.lazy(() => RoomEquipmentScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => RoomEquipmentScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => RoomEquipmentScalarWhereInputObjectSchema), z.lazy(() => RoomEquipmentScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  roomId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional()
}).strict();
export const RoomEquipmentScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => RoomEquipmentScalarWhereInputObjectSchema), z.lazy(() => RoomEquipmentScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => RoomEquipmentScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => RoomEquipmentScalarWhereInputObjectSchema), z.lazy(() => RoomEquipmentScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  roomId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional()
}).strict();
