import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EventParticipantCreateWithoutEventInputObjectSchema } from './EventParticipantCreateWithoutEventInput.schema';
import { EventParticipantUncheckedCreateWithoutEventInputObjectSchema } from './EventParticipantUncheckedCreateWithoutEventInput.schema';
import { EventParticipantCreateOrConnectWithoutEventInputObjectSchema } from './EventParticipantCreateOrConnectWithoutEventInput.schema';
import { EventParticipantUpsertWithWhereUniqueWithoutEventInputObjectSchema } from './EventParticipantUpsertWithWhereUniqueWithoutEventInput.schema';
import { EventParticipantCreateManyEventInputEnvelopeObjectSchema } from './EventParticipantCreateManyEventInputEnvelope.schema';
import { EventParticipantWhereUniqueInputObjectSchema } from './EventParticipantWhereUniqueInput.schema';
import { EventParticipantUpdateWithWhereUniqueWithoutEventInputObjectSchema } from './EventParticipantUpdateWithWhereUniqueWithoutEventInput.schema';
import { EventParticipantUpdateManyWithWhereWithoutEventInputObjectSchema } from './EventParticipantUpdateManyWithWhereWithoutEventInput.schema';
import { EventParticipantScalarWhereInputObjectSchema } from './EventParticipantScalarWhereInput.schema'

export const EventParticipantUpdateManyWithoutEventNestedInputObjectSchema: z.ZodType<Prisma.EventParticipantUpdateManyWithoutEventNestedInput, z.ZodTypeDef, Prisma.EventParticipantUpdateManyWithoutEventNestedInput> = z.object({
  create: z.union([z.lazy(() => EventParticipantCreateWithoutEventInputObjectSchema), z.lazy(() => EventParticipantCreateWithoutEventInputObjectSchema).array(), z.lazy(() => EventParticipantUncheckedCreateWithoutEventInputObjectSchema), z.lazy(() => EventParticipantUncheckedCreateWithoutEventInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => EventParticipantCreateOrConnectWithoutEventInputObjectSchema), z.lazy(() => EventParticipantCreateOrConnectWithoutEventInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => EventParticipantUpsertWithWhereUniqueWithoutEventInputObjectSchema), z.lazy(() => EventParticipantUpsertWithWhereUniqueWithoutEventInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => EventParticipantCreateManyEventInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => EventParticipantWhereUniqueInputObjectSchema), z.lazy(() => EventParticipantWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => EventParticipantWhereUniqueInputObjectSchema), z.lazy(() => EventParticipantWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => EventParticipantWhereUniqueInputObjectSchema), z.lazy(() => EventParticipantWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => EventParticipantWhereUniqueInputObjectSchema), z.lazy(() => EventParticipantWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => EventParticipantUpdateWithWhereUniqueWithoutEventInputObjectSchema), z.lazy(() => EventParticipantUpdateWithWhereUniqueWithoutEventInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => EventParticipantUpdateManyWithWhereWithoutEventInputObjectSchema), z.lazy(() => EventParticipantUpdateManyWithWhereWithoutEventInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => EventParticipantScalarWhereInputObjectSchema), z.lazy(() => EventParticipantScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const EventParticipantUpdateManyWithoutEventNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => EventParticipantCreateWithoutEventInputObjectSchema), z.lazy(() => EventParticipantCreateWithoutEventInputObjectSchema).array(), z.lazy(() => EventParticipantUncheckedCreateWithoutEventInputObjectSchema), z.lazy(() => EventParticipantUncheckedCreateWithoutEventInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => EventParticipantCreateOrConnectWithoutEventInputObjectSchema), z.lazy(() => EventParticipantCreateOrConnectWithoutEventInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => EventParticipantUpsertWithWhereUniqueWithoutEventInputObjectSchema), z.lazy(() => EventParticipantUpsertWithWhereUniqueWithoutEventInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => EventParticipantCreateManyEventInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => EventParticipantWhereUniqueInputObjectSchema), z.lazy(() => EventParticipantWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => EventParticipantWhereUniqueInputObjectSchema), z.lazy(() => EventParticipantWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => EventParticipantWhereUniqueInputObjectSchema), z.lazy(() => EventParticipantWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => EventParticipantWhereUniqueInputObjectSchema), z.lazy(() => EventParticipantWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => EventParticipantUpdateWithWhereUniqueWithoutEventInputObjectSchema), z.lazy(() => EventParticipantUpdateWithWhereUniqueWithoutEventInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => EventParticipantUpdateManyWithWhereWithoutEventInputObjectSchema), z.lazy(() => EventParticipantUpdateManyWithWhereWithoutEventInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => EventParticipantScalarWhereInputObjectSchema), z.lazy(() => EventParticipantScalarWhereInputObjectSchema).array()]).optional()
}).strict();
