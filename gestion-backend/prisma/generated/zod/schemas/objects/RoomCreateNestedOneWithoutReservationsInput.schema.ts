import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomCreateWithoutReservationsInputObjectSchema } from './RoomCreateWithoutReservationsInput.schema';
import { RoomUncheckedCreateWithoutReservationsInputObjectSchema } from './RoomUncheckedCreateWithoutReservationsInput.schema';
import { RoomCreateOrConnectWithoutReservationsInputObjectSchema } from './RoomCreateOrConnectWithoutReservationsInput.schema';
import { RoomWhereUniqueInputObjectSchema } from './RoomWhereUniqueInput.schema'

export const RoomCreateNestedOneWithoutReservationsInputObjectSchema: z.ZodType<Prisma.RoomCreateNestedOneWithoutReservationsInput, z.ZodTypeDef, Prisma.RoomCreateNestedOneWithoutReservationsInput> = z.object({
  create: z.union([z.lazy(() => RoomCreateWithoutReservationsInputObjectSchema), z.lazy(() => RoomUncheckedCreateWithoutReservationsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => RoomCreateOrConnectWithoutReservationsInputObjectSchema).optional(),
  connect: z.lazy(() => RoomWhereUniqueInputObjectSchema).optional()
}).strict();
export const RoomCreateNestedOneWithoutReservationsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => RoomCreateWithoutReservationsInputObjectSchema), z.lazy(() => RoomUncheckedCreateWithoutReservationsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => RoomCreateOrConnectWithoutReservationsInputObjectSchema).optional(),
  connect: z.lazy(() => RoomWhereUniqueInputObjectSchema).optional()
}).strict();
