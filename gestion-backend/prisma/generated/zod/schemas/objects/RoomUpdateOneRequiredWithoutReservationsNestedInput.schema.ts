import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomCreateWithoutReservationsInputObjectSchema } from './RoomCreateWithoutReservationsInput.schema';
import { RoomUncheckedCreateWithoutReservationsInputObjectSchema } from './RoomUncheckedCreateWithoutReservationsInput.schema';
import { RoomCreateOrConnectWithoutReservationsInputObjectSchema } from './RoomCreateOrConnectWithoutReservationsInput.schema';
import { RoomUpsertWithoutReservationsInputObjectSchema } from './RoomUpsertWithoutReservationsInput.schema';
import { RoomWhereUniqueInputObjectSchema } from './RoomWhereUniqueInput.schema';
import { RoomUpdateToOneWithWhereWithoutReservationsInputObjectSchema } from './RoomUpdateToOneWithWhereWithoutReservationsInput.schema';
import { RoomUpdateWithoutReservationsInputObjectSchema } from './RoomUpdateWithoutReservationsInput.schema';
import { RoomUncheckedUpdateWithoutReservationsInputObjectSchema } from './RoomUncheckedUpdateWithoutReservationsInput.schema'

export const RoomUpdateOneRequiredWithoutReservationsNestedInputObjectSchema: z.ZodType<Prisma.RoomUpdateOneRequiredWithoutReservationsNestedInput, z.ZodTypeDef, Prisma.RoomUpdateOneRequiredWithoutReservationsNestedInput> = z.object({
  create: z.union([z.lazy(() => RoomCreateWithoutReservationsInputObjectSchema), z.lazy(() => RoomUncheckedCreateWithoutReservationsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => RoomCreateOrConnectWithoutReservationsInputObjectSchema).optional(),
  upsert: z.lazy(() => RoomUpsertWithoutReservationsInputObjectSchema).optional(),
  connect: z.lazy(() => RoomWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => RoomUpdateToOneWithWhereWithoutReservationsInputObjectSchema), z.lazy(() => RoomUpdateWithoutReservationsInputObjectSchema), z.lazy(() => RoomUncheckedUpdateWithoutReservationsInputObjectSchema)]).optional()
}).strict();
export const RoomUpdateOneRequiredWithoutReservationsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => RoomCreateWithoutReservationsInputObjectSchema), z.lazy(() => RoomUncheckedCreateWithoutReservationsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => RoomCreateOrConnectWithoutReservationsInputObjectSchema).optional(),
  upsert: z.lazy(() => RoomUpsertWithoutReservationsInputObjectSchema).optional(),
  connect: z.lazy(() => RoomWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => RoomUpdateToOneWithWhereWithoutReservationsInputObjectSchema), z.lazy(() => RoomUpdateWithoutReservationsInputObjectSchema), z.lazy(() => RoomUncheckedUpdateWithoutReservationsInputObjectSchema)]).optional()
}).strict();
