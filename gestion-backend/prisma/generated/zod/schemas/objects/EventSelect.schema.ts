import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EventParticipantFindManySchema } from '../findManyEventParticipant.schema';
import { EventCountOutputTypeArgsObjectSchema } from './EventCountOutputTypeArgs.schema'

export const EventSelectObjectSchema: z.ZodType<Prisma.EventSelect, z.ZodTypeDef, Prisma.EventSelect> = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  description: z.boolean().optional(),
  startDate: z.boolean().optional(),
  endDate: z.boolean().optional(),
  location: z.boolean().optional(),
  organizer: z.boolean().optional(),
  category: z.boolean().optional(),
  participants: z.union([z.boolean(), z.lazy(() => EventParticipantFindManySchema)]).optional(),
  isPublic: z.boolean().optional(),
  status: z.boolean().optional(),
  _count: z.union([z.boolean(), z.lazy(() => EventCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const EventSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  description: z.boolean().optional(),
  startDate: z.boolean().optional(),
  endDate: z.boolean().optional(),
  location: z.boolean().optional(),
  organizer: z.boolean().optional(),
  category: z.boolean().optional(),
  participants: z.union([z.boolean(), z.lazy(() => EventParticipantFindManySchema)]).optional(),
  isPublic: z.boolean().optional(),
  status: z.boolean().optional(),
  _count: z.union([z.boolean(), z.lazy(() => EventCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
