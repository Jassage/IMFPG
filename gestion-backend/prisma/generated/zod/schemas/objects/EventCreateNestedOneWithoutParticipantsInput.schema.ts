import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EventCreateWithoutParticipantsInputObjectSchema } from './EventCreateWithoutParticipantsInput.schema';
import { EventUncheckedCreateWithoutParticipantsInputObjectSchema } from './EventUncheckedCreateWithoutParticipantsInput.schema';
import { EventCreateOrConnectWithoutParticipantsInputObjectSchema } from './EventCreateOrConnectWithoutParticipantsInput.schema';
import { EventWhereUniqueInputObjectSchema } from './EventWhereUniqueInput.schema'

export const EventCreateNestedOneWithoutParticipantsInputObjectSchema: z.ZodType<Prisma.EventCreateNestedOneWithoutParticipantsInput, z.ZodTypeDef, Prisma.EventCreateNestedOneWithoutParticipantsInput> = z.object({
  create: z.union([z.lazy(() => EventCreateWithoutParticipantsInputObjectSchema), z.lazy(() => EventUncheckedCreateWithoutParticipantsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => EventCreateOrConnectWithoutParticipantsInputObjectSchema).optional(),
  connect: z.lazy(() => EventWhereUniqueInputObjectSchema).optional()
}).strict();
export const EventCreateNestedOneWithoutParticipantsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => EventCreateWithoutParticipantsInputObjectSchema), z.lazy(() => EventUncheckedCreateWithoutParticipantsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => EventCreateOrConnectWithoutParticipantsInputObjectSchema).optional(),
  connect: z.lazy(() => EventWhereUniqueInputObjectSchema).optional()
}).strict();
