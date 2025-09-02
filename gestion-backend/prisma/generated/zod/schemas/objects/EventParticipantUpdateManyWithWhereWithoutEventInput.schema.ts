import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EventParticipantScalarWhereInputObjectSchema } from './EventParticipantScalarWhereInput.schema';
import { EventParticipantUpdateManyMutationInputObjectSchema } from './EventParticipantUpdateManyMutationInput.schema';
import { EventParticipantUncheckedUpdateManyWithoutEventInputObjectSchema } from './EventParticipantUncheckedUpdateManyWithoutEventInput.schema'

export const EventParticipantUpdateManyWithWhereWithoutEventInputObjectSchema: z.ZodType<Prisma.EventParticipantUpdateManyWithWhereWithoutEventInput, z.ZodTypeDef, Prisma.EventParticipantUpdateManyWithWhereWithoutEventInput> = z.object({
  where: z.lazy(() => EventParticipantScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => EventParticipantUpdateManyMutationInputObjectSchema), z.lazy(() => EventParticipantUncheckedUpdateManyWithoutEventInputObjectSchema)])
}).strict();
export const EventParticipantUpdateManyWithWhereWithoutEventInputObjectZodSchema = z.object({
  where: z.lazy(() => EventParticipantScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => EventParticipantUpdateManyMutationInputObjectSchema), z.lazy(() => EventParticipantUncheckedUpdateManyWithoutEventInputObjectSchema)])
}).strict();
