import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const EventParticipantCreateManyInputObjectSchema: z.ZodType<Prisma.EventParticipantCreateManyInput, z.ZodTypeDef, Prisma.EventParticipantCreateManyInput> = z.object({
  id: z.string().optional(),
  eventId: z.string(),
  name: z.string()
}).strict();
export const EventParticipantCreateManyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  eventId: z.string(),
  name: z.string()
}).strict();
