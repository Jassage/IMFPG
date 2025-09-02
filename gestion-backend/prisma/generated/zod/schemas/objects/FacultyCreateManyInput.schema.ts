import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const FacultyCreateManyInputObjectSchema: z.ZodType<Prisma.FacultyCreateManyInput, z.ZodTypeDef, Prisma.FacultyCreateManyInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  code: z.string(),
  description: z.string().nullish(),
  dean: z.string().nullish(),
  studentsCount: z.number().int().optional(),
  coursesCount: z.number().int().optional(),
  studyDuration: z.number().int(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const FacultyCreateManyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  code: z.string(),
  description: z.string().nullish(),
  dean: z.string().nullish(),
  studentsCount: z.number().int().optional(),
  coursesCount: z.number().int().optional(),
  studyDuration: z.number().int(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
