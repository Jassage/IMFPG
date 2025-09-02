import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EventArgsObjectSchema } from './EventArgs.schema'

export const EventParticipantIncludeObjectSchema: z.ZodType<Prisma.EventParticipantInclude, z.ZodTypeDef, Prisma.EventParticipantInclude> = z.object({
  event: z.union([z.boolean(), z.lazy(() => EventArgsObjectSchema)]).optional()
}).strict();
export const EventParticipantIncludeObjectZodSchema = z.object({
  event: z.union([z.boolean(), z.lazy(() => EventArgsObjectSchema)]).optional()
}).strict();
