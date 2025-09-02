import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EventCreateNestedOneWithoutParticipantsInputObjectSchema } from './EventCreateNestedOneWithoutParticipantsInput.schema'

export const EventParticipantCreateInputObjectSchema: z.ZodType<Prisma.EventParticipantCreateInput, z.ZodTypeDef, Prisma.EventParticipantCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  event: z.lazy(() => EventCreateNestedOneWithoutParticipantsInputObjectSchema)
}).strict();
export const EventParticipantCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  event: z.lazy(() => EventCreateNestedOneWithoutParticipantsInputObjectSchema)
}).strict();
