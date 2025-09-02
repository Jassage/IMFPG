import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AcademicYearWhereUniqueInputObjectSchema: z.ZodType<Prisma.AcademicYearWhereUniqueInput, z.ZodTypeDef, Prisma.AcademicYearWhereUniqueInput> = z.object({
  id: z.string(),
  year: z.string()
}).strict();
export const AcademicYearWhereUniqueInputObjectZodSchema = z.object({
  id: z.string(),
  year: z.string()
}).strict();
