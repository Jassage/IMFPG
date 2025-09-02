import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomEquipmentWhereInputObjectSchema } from './RoomEquipmentWhereInput.schema'

export const RoomEquipmentListRelationFilterObjectSchema: z.ZodType<Prisma.RoomEquipmentListRelationFilter, z.ZodTypeDef, Prisma.RoomEquipmentListRelationFilter> = z.object({
  every: z.lazy(() => RoomEquipmentWhereInputObjectSchema).optional(),
  some: z.lazy(() => RoomEquipmentWhereInputObjectSchema).optional(),
  none: z.lazy(() => RoomEquipmentWhereInputObjectSchema).optional()
}).strict();
export const RoomEquipmentListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => RoomEquipmentWhereInputObjectSchema).optional(),
  some: z.lazy(() => RoomEquipmentWhereInputObjectSchema).optional(),
  none: z.lazy(() => RoomEquipmentWhereInputObjectSchema).optional()
}).strict();
