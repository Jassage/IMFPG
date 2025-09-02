import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema'

export const EventParticipantScalarWhereInputObjectSchema: z.ZodType<Prisma.EventParticipantScalarWhereInput, z.ZodTypeDef, Prisma.EventParticipantScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => EventParticipantScalarWhereInputObjectSchema), z.lazy(() => EventParticipantScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => EventParticipantScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => EventParticipantScalarWhereInputObjectSchema), z.lazy(() => EventParticipantScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  eventId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional()
}).strict();
export const EventParticipantScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => EventParticipantScalarWhereInputObjectSchema), z.lazy(() => EventParticipantScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => EventParticipantScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => EventParticipantScalarWhereInputObjectSchema), z.lazy(() => EventParticipantScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  eventId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional()
}).strict();
