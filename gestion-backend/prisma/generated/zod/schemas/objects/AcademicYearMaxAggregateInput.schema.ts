import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AcademicYearMaxAggregateInputObjectSchema: z.ZodType<Prisma.AcademicYearMaxAggregateInputType, z.ZodTypeDef, Prisma.AcademicYearMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  year: z.literal(true).optional(),
  startDate: z.literal(true).optional(),
  endDate: z.literal(true).optional(),
  isCurrent: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const AcademicYearMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  year: z.literal(true).optional(),
  startDate: z.literal(true).optional(),
  endDate: z.literal(true).optional(),
  isCurrent: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
