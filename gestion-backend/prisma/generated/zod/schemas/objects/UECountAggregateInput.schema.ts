import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const UECountAggregateInputObjectSchema: z.ZodType<Prisma.UECountAggregateInputType, z.ZodTypeDef, Prisma.UECountAggregateInputType> = z.object({
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
  createdById: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const UECountAggregateInputObjectZodSchema = z.object({
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
  createdById: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
