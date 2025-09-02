import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema'

export const EventParticipantScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.EventParticipantScalarWhereWithAggregatesInput, z.ZodTypeDef, Prisma.EventParticipantScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => EventParticipantScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => EventParticipantScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => EventParticipantScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => EventParticipantScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => EventParticipantScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  eventId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional()
}).strict();
export const EventParticipantScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => EventParticipantScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => EventParticipantScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => EventParticipantScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => EventParticipantScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => EventParticipantScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  eventId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional()
}).strict();
