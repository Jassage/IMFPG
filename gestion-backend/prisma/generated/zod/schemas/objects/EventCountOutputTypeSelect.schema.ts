import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const EventCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.EventCountOutputTypeSelect, z.ZodTypeDef, Prisma.EventCountOutputTypeSelect> = z.object({
  participants: z.boolean().optional()
}).strict();
export const EventCountOutputTypeSelectObjectZodSchema = z.object({
  participants: z.boolean().optional()
}).strict();
