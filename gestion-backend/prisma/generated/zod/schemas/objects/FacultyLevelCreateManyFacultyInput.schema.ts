import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const FacultyLevelCreateManyFacultyInputObjectSchema: z.ZodType<Prisma.FacultyLevelCreateManyFacultyInput, z.ZodTypeDef, Prisma.FacultyLevelCreateManyFacultyInput> = z.object({
  id: z.string().optional(),
  level: z.string()
}).strict();
export const FacultyLevelCreateManyFacultyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  level: z.string()
}).strict();
