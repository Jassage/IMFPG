import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EventParticipantSelectObjectSchema } from './EventParticipantSelect.schema';
import { EventParticipantIncludeObjectSchema } from './EventParticipantInclude.schema'

export const EventParticipantArgsObjectSchema = z.object({
  select: z.lazy(() => EventParticipantSelectObjectSchema).optional(),
  include: z.lazy(() => EventParticipantIncludeObjectSchema).optional()
}).strict();
export const EventParticipantArgsObjectZodSchema = z.object({
  select: z.lazy(() => EventParticipantSelectObjectSchema).optional(),
  include: z.lazy(() => EventParticipantIncludeObjectSchema).optional()
}).strict();
