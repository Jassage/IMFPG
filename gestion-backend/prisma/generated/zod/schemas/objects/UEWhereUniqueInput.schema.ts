import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const UEWhereUniqueInputObjectSchema: z.ZodType<Prisma.UEWhereUniqueInput, z.ZodTypeDef, Prisma.UEWhereUniqueInput> = z.object({
  id: z.string(),
  code: z.string()
}).strict();
export const UEWhereUniqueInputObjectZodSchema = z.object({
  id: z.string(),
  code: z.string()
}).strict();
