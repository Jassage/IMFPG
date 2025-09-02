import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { RoomScalarRelationFilterObjectSchema } from './RoomScalarRelationFilter.schema';
import { RoomWhereInputObjectSchema } from './RoomWhereInput.schema'

export const RoomReservationWhereInputObjectSchema: z.ZodType<Prisma.RoomReservationWhereInput, z.ZodTypeDef, Prisma.RoomReservationWhereInput> = z.object({
  AND: z.union([z.lazy(() => RoomReservationWhereInputObjectSchema), z.lazy(() => RoomReservationWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => RoomReservationWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => RoomReservationWhereInputObjectSchema), z.lazy(() => RoomReservationWhereInputObjectSchema).array()]).optional(),
  roomId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  startTime: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  endTime: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  purpose: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  room: z.union([z.lazy(() => RoomScalarRelationFilterObjectSchema), z.lazy(() => RoomWhereInputObjectSchema)]).optional()
}).strict();
export const RoomReservationWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => RoomReservationWhereInputObjectSchema), z.lazy(() => RoomReservationWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => RoomReservationWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => RoomReservationWhereInputObjectSchema), z.lazy(() => RoomReservationWhereInputObjectSchema).array()]).optional(),
  roomId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  startTime: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  endTime: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  purpose: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  room: z.union([z.lazy(() => RoomScalarRelationFilterObjectSchema), z.lazy(() => RoomWhereInputObjectSchema)]).optional()
}).strict();
