import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EventParticipantWhereUniqueInputObjectSchema } from './EventParticipantWhereUniqueInput.schema';
import { EventParticipantUpdateWithoutEventInputObjectSchema } from './EventParticipantUpdateWithoutEventInput.schema';
import { EventParticipantUncheckedUpdateWithoutEventInputObjectSchema } from './EventParticipantUncheckedUpdateWithoutEventInput.schema';
import { EventParticipantCreateWithoutEventInputObjectSchema } from './EventParticipantCreateWithoutEventInput.schema';
import { EventParticipantUncheckedCreateWithoutEventInputObjectSchema } from './EventParticipantUncheckedCreateWithoutEventInput.schema'

export const EventParticipantUpsertWithWhereUniqueWithoutEventInputObjectSchema: z.ZodType<Prisma.EventParticipantUpsertWithWhereUniqueWithoutEventInput, z.ZodTypeDef, Prisma.EventParticipantUpsertWithWhereUniqueWithoutEventInput> = z.object({
  where: z.lazy(() => EventParticipantWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => EventParticipantUpdateWithoutEventInputObjectSchema), z.lazy(() => EventParticipantUncheckedUpdateWithoutEventInputObjectSchema)]),
  create: z.union([z.lazy(() => EventParticipantCreateWithoutEventInputObjectSchema), z.lazy(() => EventParticipantUncheckedCreateWithoutEventInputObjectSchema)])
}).strict();
export const EventParticipantUpsertWithWhereUniqueWithoutEventInputObjectZodSchema = z.object({
  where: z.lazy(() => EventParticipantWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => EventParticipantUpdateWithoutEventInputObjectSchema), z.lazy(() => EventParticipantUncheckedUpdateWithoutEventInputObjectSchema)]),
  create: z.union([z.lazy(() => EventParticipantCreateWithoutEventInputObjectSchema), z.lazy(() => EventParticipantUncheckedCreateWithoutEventInputObjectSchema)])
}).strict();
