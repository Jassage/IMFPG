import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const GradeWhereUniqueInputObjectSchema: z.ZodType<Prisma.GradeWhereUniqueInput, z.ZodTypeDef, Prisma.GradeWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const GradeWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
