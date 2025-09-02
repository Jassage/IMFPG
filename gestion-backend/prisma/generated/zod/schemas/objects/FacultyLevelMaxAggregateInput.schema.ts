import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const FacultyLevelMaxAggregateInputObjectSchema: z.ZodType<Prisma.FacultyLevelMaxAggregateInputType, z.ZodTypeDef, Prisma.FacultyLevelMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  facultyId: z.literal(true).optional(),
  level: z.literal(true).optional()
}).strict();
export const FacultyLevelMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  facultyId: z.literal(true).optional(),
  level: z.literal(true).optional()
}).strict();
