import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EventParticipantWhereInputObjectSchema } from './EventParticipantWhereInput.schema'

export const EventParticipantListRelationFilterObjectSchema: z.ZodType<Prisma.EventParticipantListRelationFilter, z.ZodTypeDef, Prisma.EventParticipantListRelationFilter> = z.object({
  every: z.lazy(() => EventParticipantWhereInputObjectSchema).optional(),
  some: z.lazy(() => EventParticipantWhereInputObjectSchema).optional(),
  none: z.lazy(() => EventParticipantWhereInputObjectSchema).optional()
}).strict();
export const EventParticipantListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => EventParticipantWhereInputObjectSchema).optional(),
  some: z.lazy(() => EventParticipantWhereInputObjectSchema).optional(),
  none: z.lazy(() => EventParticipantWhereInputObjectSchema).optional()
}).strict();
