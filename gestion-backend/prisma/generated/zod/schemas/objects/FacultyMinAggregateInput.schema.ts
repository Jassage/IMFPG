import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const FacultyMinAggregateInputObjectSchema: z.ZodType<Prisma.FacultyMinAggregateInputType, z.ZodTypeDef, Prisma.FacultyMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  code: z.literal(true).optional(),
  description: z.literal(true).optional(),
  dean: z.literal(true).optional(),
  studentsCount: z.literal(true).optional(),
  coursesCount: z.literal(true).optional(),
  studyDuration: z.literal(true).optional(),
  status: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const FacultyMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  code: z.literal(true).optional(),
  description: z.literal(true).optional(),
  dean: z.literal(true).optional(),
  studentsCount: z.literal(true).optional(),
  coursesCount: z.literal(true).optional(),
  studyDuration: z.literal(true).optional(),
  status: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
