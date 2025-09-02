import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema'

export const RoomEquipmentScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.RoomEquipmentScalarWhereWithAggregatesInput, z.ZodTypeDef, Prisma.RoomEquipmentScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => RoomEquipmentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => RoomEquipmentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => RoomEquipmentScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => RoomEquipmentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => RoomEquipmentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  roomId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional()
}).strict();
export const RoomEquipmentScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => RoomEquipmentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => RoomEquipmentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => RoomEquipmentScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => RoomEquipmentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => RoomEquipmentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  roomId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional()
}).strict();
