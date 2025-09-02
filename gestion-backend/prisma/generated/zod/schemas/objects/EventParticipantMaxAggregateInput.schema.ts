import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const EventParticipantMaxAggregateInputObjectSchema: z.ZodType<Prisma.EventParticipantMaxAggregateInputType, z.ZodTypeDef, Prisma.EventParticipantMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  eventId: z.literal(true).optional(),
  name: z.literal(true).optional()
}).strict();
export const EventParticipantMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  eventId: z.literal(true).optional(),
  name: z.literal(true).optional()
}).strict();
