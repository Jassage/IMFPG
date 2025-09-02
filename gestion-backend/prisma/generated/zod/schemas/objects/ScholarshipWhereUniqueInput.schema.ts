import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ScholarshipWhereUniqueInputObjectSchema: z.ZodType<Prisma.ScholarshipWhereUniqueInput, z.ZodTypeDef, Prisma.ScholarshipWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const ScholarshipWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
