import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EventParticipantCreateNestedManyWithoutEventInputObjectSchema } from './EventParticipantCreateNestedManyWithoutEventInput.schema'

export const EventCreateInputObjectSchema: z.ZodType<Prisma.EventCreateInput, z.ZodTypeDef, Prisma.EventCreateInput> = z.object({
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
  participants: z.lazy(() => EventParticipantCreateNestedManyWithoutEventInputObjectSchema).optional()
}).strict();
export const EventCreateInputObjectZodSchema = z.object({
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
  participants: z.lazy(() => EventParticipantCreateNestedManyWithoutEventInputObjectSchema).optional()
}).strict();
