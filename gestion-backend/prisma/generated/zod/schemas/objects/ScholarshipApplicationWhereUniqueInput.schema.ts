import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ScholarshipApplicationWhereUniqueInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationWhereUniqueInput, z.ZodTypeDef, Prisma.ScholarshipApplicationWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const ScholarshipApplicationWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
