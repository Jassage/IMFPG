import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const RoomCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.RoomCountOutputTypeSelect, z.ZodTypeDef, Prisma.RoomCountOutputTypeSelect> = z.object({
  equipment: z.boolean().optional(),
  reservations: z.boolean().optional()
}).strict();
export const RoomCountOutputTypeSelectObjectZodSchema = z.object({
  equipment: z.boolean().optional(),
  reservations: z.boolean().optional()
}).strict();
