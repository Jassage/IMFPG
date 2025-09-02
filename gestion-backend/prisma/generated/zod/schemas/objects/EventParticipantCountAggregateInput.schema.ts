import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const EventParticipantCountAggregateInputObjectSchema: z.ZodType<Prisma.EventParticipantCountAggregateInputType, z.ZodTypeDef, Prisma.EventParticipantCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  eventId: z.literal(true).optional(),
  name: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const EventParticipantCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  eventId: z.literal(true).optional(),
  name: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
