import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const EventCountAggregateInputObjectSchema: z.ZodType<Prisma.EventCountAggregateInputType, z.ZodTypeDef, Prisma.EventCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  title: z.literal(true).optional(),
  description: z.literal(true).optional(),
  startDate: z.literal(true).optional(),
  endDate: z.literal(true).optional(),
  location: z.literal(true).optional(),
  organizer: z.literal(true).optional(),
  category: z.literal(true).optional(),
  isPublic: z.literal(true).optional(),
  status: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const EventCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  title: z.literal(true).optional(),
  description: z.literal(true).optional(),
  startDate: z.literal(true).optional(),
  endDate: z.literal(true).optional(),
  location: z.literal(true).optional(),
  organizer: z.literal(true).optional(),
  category: z.literal(true).optional(),
  isPublic: z.literal(true).optional(),
  status: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
