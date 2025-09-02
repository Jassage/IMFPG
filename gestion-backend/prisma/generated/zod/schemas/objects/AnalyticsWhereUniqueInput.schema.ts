import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AnalyticsWhereUniqueInputObjectSchema: z.ZodType<Prisma.AnalyticsWhereUniqueInput, z.ZodTypeDef, Prisma.AnalyticsWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const AnalyticsWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
