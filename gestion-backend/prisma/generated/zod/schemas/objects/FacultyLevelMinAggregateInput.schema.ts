import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const FacultyLevelMinAggregateInputObjectSchema: z.ZodType<Prisma.FacultyLevelMinAggregateInputType, z.ZodTypeDef, Prisma.FacultyLevelMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  facultyId: z.literal(true).optional(),
  level: z.literal(true).optional()
}).strict();
export const FacultyLevelMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  facultyId: z.literal(true).optional(),
  level: z.literal(true).optional()
}).strict();
