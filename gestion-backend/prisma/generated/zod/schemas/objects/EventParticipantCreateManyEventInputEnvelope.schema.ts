import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EventParticipantCreateManyEventInputObjectSchema } from './EventParticipantCreateManyEventInput.schema'

export const EventParticipantCreateManyEventInputEnvelopeObjectSchema: z.ZodType<Prisma.EventParticipantCreateManyEventInputEnvelope, z.ZodTypeDef, Prisma.EventParticipantCreateManyEventInputEnvelope> = z.object({
  data: z.union([z.lazy(() => EventParticipantCreateManyEventInputObjectSchema), z.lazy(() => EventParticipantCreateManyEventInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const EventParticipantCreateManyEventInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => EventParticipantCreateManyEventInputObjectSchema), z.lazy(() => EventParticipantCreateManyEventInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
