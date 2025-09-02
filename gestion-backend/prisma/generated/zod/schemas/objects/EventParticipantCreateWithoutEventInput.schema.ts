import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const EventParticipantCreateWithoutEventInputObjectSchema: z.ZodType<Prisma.EventParticipantCreateWithoutEventInput, z.ZodTypeDef, Prisma.EventParticipantCreateWithoutEventInput> = z.object({
  id: z.string().optional(),
  name: z.string()
}).strict();
export const EventParticipantCreateWithoutEventInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string()
}).strict();
