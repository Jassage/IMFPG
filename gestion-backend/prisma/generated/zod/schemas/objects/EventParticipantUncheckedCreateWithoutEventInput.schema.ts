import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const EventParticipantUncheckedCreateWithoutEventInputObjectSchema: z.ZodType<Prisma.EventParticipantUncheckedCreateWithoutEventInput, z.ZodTypeDef, Prisma.EventParticipantUncheckedCreateWithoutEventInput> = z.object({
  id: z.string().optional(),
  name: z.string()
}).strict();
export const EventParticipantUncheckedCreateWithoutEventInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string()
}).strict();
