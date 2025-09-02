import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EventParticipantWhereUniqueInputObjectSchema } from './EventParticipantWhereUniqueInput.schema';
import { EventParticipantCreateWithoutEventInputObjectSchema } from './EventParticipantCreateWithoutEventInput.schema';
import { EventParticipantUncheckedCreateWithoutEventInputObjectSchema } from './EventParticipantUncheckedCreateWithoutEventInput.schema'

export const EventParticipantCreateOrConnectWithoutEventInputObjectSchema: z.ZodType<Prisma.EventParticipantCreateOrConnectWithoutEventInput, z.ZodTypeDef, Prisma.EventParticipantCreateOrConnectWithoutEventInput> = z.object({
  where: z.lazy(() => EventParticipantWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => EventParticipantCreateWithoutEventInputObjectSchema), z.lazy(() => EventParticipantUncheckedCreateWithoutEventInputObjectSchema)])
}).strict();
export const EventParticipantCreateOrConnectWithoutEventInputObjectZodSchema = z.object({
  where: z.lazy(() => EventParticipantWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => EventParticipantCreateWithoutEventInputObjectSchema), z.lazy(() => EventParticipantUncheckedCreateWithoutEventInputObjectSchema)])
}).strict();
