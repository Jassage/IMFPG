import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EventParticipantFindManySchema } from '../findManyEventParticipant.schema';
import { EventCountOutputTypeArgsObjectSchema } from './EventCountOutputTypeArgs.schema'

export const EventIncludeObjectSchema: z.ZodType<Prisma.EventInclude, z.ZodTypeDef, Prisma.EventInclude> = z.object({
  participants: z.union([z.boolean(), z.lazy(() => EventParticipantFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => EventCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const EventIncludeObjectZodSchema = z.object({
  participants: z.union([z.boolean(), z.lazy(() => EventParticipantFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => EventCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
