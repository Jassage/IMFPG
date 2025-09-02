import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const RoomReservationWhereUniqueInputObjectSchema: z.ZodType<Prisma.RoomReservationWhereUniqueInput, z.ZodTypeDef, Prisma.RoomReservationWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const RoomReservationWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
