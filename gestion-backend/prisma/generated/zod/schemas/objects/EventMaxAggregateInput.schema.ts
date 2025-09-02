import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const EventMaxAggregateInputObjectSchema: z.ZodType<Prisma.EventMaxAggregateInputType, z.ZodTypeDef, Prisma.EventMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  title: z.literal(true).optional(),
  description: z.literal(true).optional(),
  startDate: z.literal(true).optional(),
  endDate: z.literal(true).optional(),
  location: z.literal(true).optional(),
  organizer: z.literal(true).optional(),
  category: z.literal(true).optional(),
  isPublic: z.literal(true).optional(),
  status: z.literal(true).optional()
}).strict();
export const EventMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  title: z.literal(true).optional(),
  description: z.literal(true).optional(),
  startDate: z.literal(true).optional(),
  endDate: z.literal(true).optional(),
  location: z.literal(true).optional(),
  organizer: z.literal(true).optional(),
  category: z.literal(true).optional(),
  isPublic: z.literal(true).optional(),
  status: z.literal(true).optional()
}).strict();
