import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const EventParticipantUncheckedCreateInputObjectSchema: z.ZodType<Prisma.EventParticipantUncheckedCreateInput, z.ZodTypeDef, Prisma.EventParticipantUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  eventId: z.string(),
  name: z.string()
}).strict();
export const EventParticipantUncheckedCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  eventId: z.string(),
  name: z.string()
}).strict();
