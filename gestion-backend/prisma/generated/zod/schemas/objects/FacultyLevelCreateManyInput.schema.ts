import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const FacultyLevelCreateManyInputObjectSchema: z.ZodType<Prisma.FacultyLevelCreateManyInput, z.ZodTypeDef, Prisma.FacultyLevelCreateManyInput> = z.object({
  id: z.string().optional(),
  facultyId: z.string(),
  level: z.string().max(10)
}).strict();
export const FacultyLevelCreateManyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  facultyId: z.string(),
  level: z.string().max(10)
}).strict();
