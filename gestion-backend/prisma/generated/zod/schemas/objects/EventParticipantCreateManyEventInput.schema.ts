import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const EventParticipantCreateManyEventInputObjectSchema: z.ZodType<Prisma.EventParticipantCreateManyEventInput, z.ZodTypeDef, Prisma.EventParticipantCreateManyEventInput> = z.object({
  id: z.string().optional(),
  name: z.string()
}).strict();
export const EventParticipantCreateManyEventInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string()
}).strict();
