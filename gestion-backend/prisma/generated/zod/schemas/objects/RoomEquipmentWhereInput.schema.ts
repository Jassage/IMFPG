import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { RoomScalarRelationFilterObjectSchema } from './RoomScalarRelationFilter.schema';
import { RoomWhereInputObjectSchema } from './RoomWhereInput.schema'

export const RoomEquipmentWhereInputObjectSchema: z.ZodType<Prisma.RoomEquipmentWhereInput, z.ZodTypeDef, Prisma.RoomEquipmentWhereInput> = z.object({
  AND: z.union([z.lazy(() => RoomEquipmentWhereInputObjectSchema), z.lazy(() => RoomEquipmentWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => RoomEquipmentWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => RoomEquipmentWhereInputObjectSchema), z.lazy(() => RoomEquipmentWhereInputObjectSchema).array()]).optional(),
  roomId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  room: z.union([z.lazy(() => RoomScalarRelationFilterObjectSchema), z.lazy(() => RoomWhereInputObjectSchema)]).optional()
}).strict();
export const RoomEquipmentWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => RoomEquipmentWhereInputObjectSchema), z.lazy(() => RoomEquipmentWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => RoomEquipmentWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => RoomEquipmentWhereInputObjectSchema), z.lazy(() => RoomEquipmentWhereInputObjectSchema).array()]).optional(),
  roomId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  room: z.union([z.lazy(() => RoomScalarRelationFilterObjectSchema), z.lazy(() => RoomWhereInputObjectSchema)]).optional()
}).strict();
