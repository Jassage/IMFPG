import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema'

export const RoomReservationScalarWhereInputObjectSchema: z.ZodType<Prisma.RoomReservationScalarWhereInput, z.ZodTypeDef, Prisma.RoomReservationScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => RoomReservationScalarWhereInputObjectSchema), z.lazy(() => RoomReservationScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => RoomReservationScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => RoomReservationScalarWhereInputObjectSchema), z.lazy(() => RoomReservationScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  roomId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  startTime: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  endTime: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  purpose: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional()
}).strict();
export const RoomReservationScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => RoomReservationScalarWhereInputObjectSchema), z.lazy(() => RoomReservationScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => RoomReservationScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => RoomReservationScalarWhereInputObjectSchema), z.lazy(() => RoomReservationScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  roomId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  startTime: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  endTime: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  purpose: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional()
}).strict();
