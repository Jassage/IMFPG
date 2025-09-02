import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { RoomEquipmentListRelationFilterObjectSchema } from './RoomEquipmentListRelationFilter.schema';
import { RoomReservationListRelationFilterObjectSchema } from './RoomReservationListRelationFilter.schema'

export const RoomWhereInputObjectSchema: z.ZodType<Prisma.RoomWhereInput, z.ZodTypeDef, Prisma.RoomWhereInput> = z.object({
  AND: z.union([z.lazy(() => RoomWhereInputObjectSchema), z.lazy(() => RoomWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => RoomWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => RoomWhereInputObjectSchema), z.lazy(() => RoomWhereInputObjectSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  capacity: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  location: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  equipment: z.lazy(() => RoomEquipmentListRelationFilterObjectSchema).optional(),
  reservations: z.lazy(() => RoomReservationListRelationFilterObjectSchema).optional()
}).strict();
export const RoomWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => RoomWhereInputObjectSchema), z.lazy(() => RoomWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => RoomWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => RoomWhereInputObjectSchema), z.lazy(() => RoomWhereInputObjectSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  capacity: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  location: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  equipment: z.lazy(() => RoomEquipmentListRelationFilterObjectSchema).optional(),
  reservations: z.lazy(() => RoomReservationListRelationFilterObjectSchema).optional()
}).strict();
