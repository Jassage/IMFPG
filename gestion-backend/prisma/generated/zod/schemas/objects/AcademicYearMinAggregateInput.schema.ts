import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AcademicYearMinAggregateInputObjectSchema: z.ZodType<Prisma.AcademicYearMinAggregateInputType, z.ZodTypeDef, Prisma.AcademicYearMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  year: z.literal(true).optional(),
  startDate: z.literal(true).optional(),
  endDate: z.literal(true).optional(),
  isCurrent: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const AcademicYearMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  year: z.literal(true).optional(),
  startDate: z.literal(true).optional(),
  endDate: z.literal(true).optional(),
  isCurrent: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
