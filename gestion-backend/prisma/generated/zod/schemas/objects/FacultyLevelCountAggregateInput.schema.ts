import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const FacultyLevelCountAggregateInputObjectSchema: z.ZodType<Prisma.FacultyLevelCountAggregateInputType, z.ZodTypeDef, Prisma.FacultyLevelCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  facultyId: z.literal(true).optional(),
  level: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const FacultyLevelCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  facultyId: z.literal(true).optional(),
  level: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
