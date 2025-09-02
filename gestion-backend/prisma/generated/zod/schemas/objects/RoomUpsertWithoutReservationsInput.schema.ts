import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomUpdateWithoutReservationsInputObjectSchema } from './RoomUpdateWithoutReservationsInput.schema';
import { RoomUncheckedUpdateWithoutReservationsInputObjectSchema } from './RoomUncheckedUpdateWithoutReservationsInput.schema';
import { RoomCreateWithoutReservationsInputObjectSchema } from './RoomCreateWithoutReservationsInput.schema';
import { RoomUncheckedCreateWithoutReservationsInputObjectSchema } from './RoomUncheckedCreateWithoutReservationsInput.schema';
import { RoomWhereInputObjectSchema } from './RoomWhereInput.schema'

export const RoomUpsertWithoutReservationsInputObjectSchema: z.ZodType<Prisma.RoomUpsertWithoutReservationsInput, z.ZodTypeDef, Prisma.RoomUpsertWithoutReservationsInput> = z.object({
  update: z.union([z.lazy(() => RoomUpdateWithoutReservationsInputObjectSchema), z.lazy(() => RoomUncheckedUpdateWithoutReservationsInputObjectSchema)]),
  create: z.union([z.lazy(() => RoomCreateWithoutReservationsInputObjectSchema), z.lazy(() => RoomUncheckedCreateWithoutReservationsInputObjectSchema)]),
  where: z.lazy(() => RoomWhereInputObjectSchema).optional()
}).strict();
export const RoomUpsertWithoutReservationsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => RoomUpdateWithoutReservationsInputObjectSchema), z.lazy(() => RoomUncheckedUpdateWithoutReservationsInputObjectSchema)]),
  create: z.union([z.lazy(() => RoomCreateWithoutReservationsInputObjectSchema), z.lazy(() => RoomUncheckedCreateWithoutReservationsInputObjectSchema)]),
  where: z.lazy(() => RoomWhereInputObjectSchema).optional()
}).strict();
