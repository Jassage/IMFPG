import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EventParticipantWhereUniqueInputObjectSchema } from './EventParticipantWhereUniqueInput.schema';
import { EventParticipantUpdateWithoutEventInputObjectSchema } from './EventParticipantUpdateWithoutEventInput.schema';
import { EventParticipantUncheckedUpdateWithoutEventInputObjectSchema } from './EventParticipantUncheckedUpdateWithoutEventInput.schema'

export const EventParticipantUpdateWithWhereUniqueWithoutEventInputObjectSchema: z.ZodType<Prisma.EventParticipantUpdateWithWhereUniqueWithoutEventInput, z.ZodTypeDef, Prisma.EventParticipantUpdateWithWhereUniqueWithoutEventInput> = z.object({
  where: z.lazy(() => EventParticipantWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => EventParticipantUpdateWithoutEventInputObjectSchema), z.lazy(() => EventParticipantUncheckedUpdateWithoutEventInputObjectSchema)])
}).strict();
export const EventParticipantUpdateWithWhereUniqueWithoutEventInputObjectZodSchema = z.object({
  where: z.lazy(() => EventParticipantWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => EventParticipantUpdateWithoutEventInputObjectSchema), z.lazy(() => EventParticipantUncheckedUpdateWithoutEventInputObjectSchema)])
}).strict();
