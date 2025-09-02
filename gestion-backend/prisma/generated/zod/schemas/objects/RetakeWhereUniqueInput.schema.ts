import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const RetakeWhereUniqueInputObjectSchema: z.ZodType<Prisma.RetakeWhereUniqueInput, z.ZodTypeDef, Prisma.RetakeWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const RetakeWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
