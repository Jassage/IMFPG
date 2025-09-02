import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { EventScalarRelationFilterObjectSchema } from './EventScalarRelationFilter.schema';
import { EventWhereInputObjectSchema } from './EventWhereInput.schema'

export const EventParticipantWhereInputObjectSchema: z.ZodType<Prisma.EventParticipantWhereInput, z.ZodTypeDef, Prisma.EventParticipantWhereInput> = z.object({
  AND: z.union([z.lazy(() => EventParticipantWhereInputObjectSchema), z.lazy(() => EventParticipantWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => EventParticipantWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => EventParticipantWhereInputObjectSchema), z.lazy(() => EventParticipantWhereInputObjectSchema).array()]).optional(),
  eventId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  event: z.union([z.lazy(() => EventScalarRelationFilterObjectSchema), z.lazy(() => EventWhereInputObjectSchema)]).optional()
}).strict();
export const EventParticipantWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => EventParticipantWhereInputObjectSchema), z.lazy(() => EventParticipantWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => EventParticipantWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => EventParticipantWhereInputObjectSchema), z.lazy(() => EventParticipantWhereInputObjectSchema).array()]).optional(),
  eventId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  event: z.union([z.lazy(() => EventScalarRelationFilterObjectSchema), z.lazy(() => EventWhereInputObjectSchema)]).optional()
}).strict();
