import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EventParticipantCreateWithoutEventInputObjectSchema } from './EventParticipantCreateWithoutEventInput.schema';
import { EventParticipantUncheckedCreateWithoutEventInputObjectSchema } from './EventParticipantUncheckedCreateWithoutEventInput.schema';
import { EventParticipantCreateOrConnectWithoutEventInputObjectSchema } from './EventParticipantCreateOrConnectWithoutEventInput.schema';
import { EventParticipantCreateManyEventInputEnvelopeObjectSchema } from './EventParticipantCreateManyEventInputEnvelope.schema';
import { EventParticipantWhereUniqueInputObjectSchema } from './EventParticipantWhereUniqueInput.schema'

export const EventParticipantUncheckedCreateNestedManyWithoutEventInputObjectSchema: z.ZodType<Prisma.EventParticipantUncheckedCreateNestedManyWithoutEventInput, z.ZodTypeDef, Prisma.EventParticipantUncheckedCreateNestedManyWithoutEventInput> = z.object({
  create: z.union([z.lazy(() => EventParticipantCreateWithoutEventInputObjectSchema), z.lazy(() => EventParticipantCreateWithoutEventInputObjectSchema).array(), z.lazy(() => EventParticipantUncheckedCreateWithoutEventInputObjectSchema), z.lazy(() => EventParticipantUncheckedCreateWithoutEventInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => EventParticipantCreateOrConnectWithoutEventInputObjectSchema), z.lazy(() => EventParticipantCreateOrConnectWithoutEventInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => EventParticipantCreateManyEventInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => EventParticipantWhereUniqueInputObjectSchema), z.lazy(() => EventParticipantWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const EventParticipantUncheckedCreateNestedManyWithoutEventInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => EventParticipantCreateWithoutEventInputObjectSchema), z.lazy(() => EventParticipantCreateWithoutEventInputObjectSchema).array(), z.lazy(() => EventParticipantUncheckedCreateWithoutEventInputObjectSchema), z.lazy(() => EventParticipantUncheckedCreateWithoutEventInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => EventParticipantCreateOrConnectWithoutEventInputObjectSchema), z.lazy(() => EventParticipantCreateOrConnectWithoutEventInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => EventParticipantCreateManyEventInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => EventParticipantWhereUniqueInputObjectSchema), z.lazy(() => EventParticipantWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
