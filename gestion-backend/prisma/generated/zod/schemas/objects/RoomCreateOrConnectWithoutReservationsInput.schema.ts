import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomWhereUniqueInputObjectSchema } from './RoomWhereUniqueInput.schema';
import { RoomCreateWithoutReservationsInputObjectSchema } from './RoomCreateWithoutReservationsInput.schema';
import { RoomUncheckedCreateWithoutReservationsInputObjectSchema } from './RoomUncheckedCreateWithoutReservationsInput.schema'

export const RoomCreateOrConnectWithoutReservationsInputObjectSchema: z.ZodType<Prisma.RoomCreateOrConnectWithoutReservationsInput, z.ZodTypeDef, Prisma.RoomCreateOrConnectWithoutReservationsInput> = z.object({
  where: z.lazy(() => RoomWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => RoomCreateWithoutReservationsInputObjectSchema), z.lazy(() => RoomUncheckedCreateWithoutReservationsInputObjectSchema)])
}).strict();
export const RoomCreateOrConnectWithoutReservationsInputObjectZodSchema = z.object({
  where: z.lazy(() => RoomWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => RoomCreateWithoutReservationsInputObjectSchema), z.lazy(() => RoomUncheckedCreateWithoutReservationsInputObjectSchema)])
}).strict();
