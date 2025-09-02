import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EventArgsObjectSchema } from './EventArgs.schema'

export const EventParticipantSelectObjectSchema: z.ZodType<Prisma.EventParticipantSelect, z.ZodTypeDef, Prisma.EventParticipantSelect> = z.object({
  id: z.boolean().optional(),
  eventId: z.boolean().optional(),
  event: z.union([z.boolean(), z.lazy(() => EventArgsObjectSchema)]).optional(),
  name: z.boolean().optional()
}).strict();
export const EventParticipantSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  eventId: z.boolean().optional(),
  event: z.union([z.boolean(), z.lazy(() => EventArgsObjectSchema)]).optional(),
  name: z.boolean().optional()
}).strict();
