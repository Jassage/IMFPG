import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomWhereInputObjectSchema } from './RoomWhereInput.schema';
import { RoomUpdateWithoutReservationsInputObjectSchema } from './RoomUpdateWithoutReservationsInput.schema';
import { RoomUncheckedUpdateWithoutReservationsInputObjectSchema } from './RoomUncheckedUpdateWithoutReservationsInput.schema'

export const RoomUpdateToOneWithWhereWithoutReservationsInputObjectSchema: z.ZodType<Prisma.RoomUpdateToOneWithWhereWithoutReservationsInput, z.ZodTypeDef, Prisma.RoomUpdateToOneWithWhereWithoutReservationsInput> = z.object({
  where: z.lazy(() => RoomWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => RoomUpdateWithoutReservationsInputObjectSchema), z.lazy(() => RoomUncheckedUpdateWithoutReservationsInputObjectSchema)])
}).strict();
export const RoomUpdateToOneWithWhereWithoutReservationsInputObjectZodSchema = z.object({
  where: z.lazy(() => RoomWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => RoomUpdateWithoutReservationsInputObjectSchema), z.lazy(() => RoomUncheckedUpdateWithoutReservationsInputObjectSchema)])
}).strict();
