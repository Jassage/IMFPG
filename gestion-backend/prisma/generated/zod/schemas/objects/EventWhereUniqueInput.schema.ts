import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const EventWhereUniqueInputObjectSchema: z.ZodType<Prisma.EventWhereUniqueInput, z.ZodTypeDef, Prisma.EventWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const EventWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
