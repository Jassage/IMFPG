import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const RoomCreateManyInputObjectSchema: z.ZodType<Prisma.RoomCreateManyInput, z.ZodTypeDef, Prisma.RoomCreateManyInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.string(),
  capacity: z.number().int(),
  location: z.string().nullish(),
  status: z.string()
}).strict();
export const RoomCreateManyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.string(),
  capacity: z.number().int(),
  location: z.string().nullish(),
  status: z.string()
}).strict();
