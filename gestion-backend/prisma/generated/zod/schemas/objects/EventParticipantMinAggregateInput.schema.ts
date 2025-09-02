import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const EventParticipantMinAggregateInputObjectSchema: z.ZodType<Prisma.EventParticipantMinAggregateInputType, z.ZodTypeDef, Prisma.EventParticipantMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  eventId: z.literal(true).optional(),
  name: z.literal(true).optional()
}).strict();
export const EventParticipantMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  eventId: z.literal(true).optional(),
  name: z.literal(true).optional()
}).strict();
