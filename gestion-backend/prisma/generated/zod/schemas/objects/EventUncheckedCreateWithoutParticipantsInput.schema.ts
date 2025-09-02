import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const EventUncheckedCreateWithoutParticipantsInputObjectSchema: z.ZodType<Prisma.EventUncheckedCreateWithoutParticipantsInput, z.ZodTypeDef, Prisma.EventUncheckedCreateWithoutParticipantsInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string().nullish(),
  startDate: z.date(),
  endDate: z.date(),
  location: z.string().nullish(),
  organizer: z.string().nullish(),
  category: z.string(),
  isPublic: z.boolean().optional(),
  status: z.string()
}).strict();
export const EventUncheckedCreateWithoutParticipantsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string().nullish(),
  startDate: z.date(),
  endDate: z.date(),
  location: z.string().nullish(),
  organizer: z.string().nullish(),
  category: z.string(),
  isPublic: z.boolean().optional(),
  status: z.string()
}).strict();
