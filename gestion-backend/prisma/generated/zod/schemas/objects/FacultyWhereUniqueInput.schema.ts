import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const FacultyWhereUniqueInputObjectSchema: z.ZodType<Prisma.FacultyWhereUniqueInput, z.ZodTypeDef, Prisma.FacultyWhereUniqueInput> = z.object({
  id: z.string(),
  code: z.string()
}).strict();
export const FacultyWhereUniqueInputObjectZodSchema = z.object({
  id: z.string(),
  code: z.string()
}).strict();
