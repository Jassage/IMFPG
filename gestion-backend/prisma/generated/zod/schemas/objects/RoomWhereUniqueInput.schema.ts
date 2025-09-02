import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const RoomWhereUniqueInputObjectSchema: z.ZodType<Prisma.RoomWhereUniqueInput, z.ZodTypeDef, Prisma.RoomWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const RoomWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
