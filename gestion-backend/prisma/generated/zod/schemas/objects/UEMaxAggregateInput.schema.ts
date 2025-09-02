import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const UEMaxAggregateInputObjectSchema: z.ZodType<Prisma.UEMaxAggregateInputType, z.ZodTypeDef, Prisma.UEMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  code: z.literal(true).optional(),
  title: z.literal(true).optional(),
  credits: z.literal(true).optional(),
  type: z.literal(true).optional(),
  passingGrade: z.literal(true).optional(),
  description: z.literal(true).optional(),
  objectives: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  createdById: z.literal(true).optional()
}).strict();
export const UEMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  code: z.literal(true).optional(),
  title: z.literal(true).optional(),
  credits: z.literal(true).optional(),
  type: z.literal(true).optional(),
  passingGrade: z.literal(true).optional(),
  description: z.literal(true).optional(),
  objectives: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  createdById: z.literal(true).optional()
}).strict();
