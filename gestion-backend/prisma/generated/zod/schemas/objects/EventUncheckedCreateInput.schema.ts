import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EventParticipantUncheckedCreateNestedManyWithoutEventInputObjectSchema } from './EventParticipantUncheckedCreateNestedManyWithoutEventInput.schema'

export const EventUncheckedCreateInputObjectSchema: z.ZodType<Prisma.EventUncheckedCreateInput, z.ZodTypeDef, Prisma.EventUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string().nullish(),
  startDate: z.date(),
  endDate: z.date(),
  location: z.string().nullish(),
  organizer: z.string().nullish(),
  category: z.string(),
  isPublic: z.boolean().optional(),
  status: z.string(),
  participants: z.lazy(() => EventParticipantUncheckedCreateNestedManyWithoutEventInputObjectSchema).optional()
}).strict();
export const EventUncheckedCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string().nullish(),
  startDate: z.date(),
  endDate: z.date(),
  location: z.string().nullish(),
  organizer: z.string().nullish(),
  category: z.string(),
  isPublic: z.boolean().optional(),
  status: z.string(),
  participants: z.lazy(() => EventParticipantUncheckedCreateNestedManyWithoutEventInputObjectSchema).optional()
}).strict();
