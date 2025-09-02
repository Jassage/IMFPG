import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EventWhereUniqueInputObjectSchema } from './EventWhereUniqueInput.schema';
import { EventCreateWithoutParticipantsInputObjectSchema } from './EventCreateWithoutParticipantsInput.schema';
import { EventUncheckedCreateWithoutParticipantsInputObjectSchema } from './EventUncheckedCreateWithoutParticipantsInput.schema'

export const EventCreateOrConnectWithoutParticipantsInputObjectSchema: z.ZodType<Prisma.EventCreateOrConnectWithoutParticipantsInput, z.ZodTypeDef, Prisma.EventCreateOrConnectWithoutParticipantsInput> = z.object({
  where: z.lazy(() => EventWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => EventCreateWithoutParticipantsInputObjectSchema), z.lazy(() => EventUncheckedCreateWithoutParticipantsInputObjectSchema)])
}).strict();
export const EventCreateOrConnectWithoutParticipantsInputObjectZodSchema = z.object({
  where: z.lazy(() => EventWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => EventCreateWithoutParticipantsInputObjectSchema), z.lazy(() => EventUncheckedCreateWithoutParticipantsInputObjectSchema)])
}).strict();
