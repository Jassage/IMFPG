import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EventUpdateWithoutParticipantsInputObjectSchema } from './EventUpdateWithoutParticipantsInput.schema';
import { EventUncheckedUpdateWithoutParticipantsInputObjectSchema } from './EventUncheckedUpdateWithoutParticipantsInput.schema';
import { EventCreateWithoutParticipantsInputObjectSchema } from './EventCreateWithoutParticipantsInput.schema';
import { EventUncheckedCreateWithoutParticipantsInputObjectSchema } from './EventUncheckedCreateWithoutParticipantsInput.schema';
import { EventWhereInputObjectSchema } from './EventWhereInput.schema'

export const EventUpsertWithoutParticipantsInputObjectSchema: z.ZodType<Prisma.EventUpsertWithoutParticipantsInput, z.ZodTypeDef, Prisma.EventUpsertWithoutParticipantsInput> = z.object({
  update: z.union([z.lazy(() => EventUpdateWithoutParticipantsInputObjectSchema), z.lazy(() => EventUncheckedUpdateWithoutParticipantsInputObjectSchema)]),
  create: z.union([z.lazy(() => EventCreateWithoutParticipantsInputObjectSchema), z.lazy(() => EventUncheckedCreateWithoutParticipantsInputObjectSchema)]),
  where: z.lazy(() => EventWhereInputObjectSchema).optional()
}).strict();
export const EventUpsertWithoutParticipantsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => EventUpdateWithoutParticipantsInputObjectSchema), z.lazy(() => EventUncheckedUpdateWithoutParticipantsInputObjectSchema)]),
  create: z.union([z.lazy(() => EventCreateWithoutParticipantsInputObjectSchema), z.lazy(() => EventUncheckedCreateWithoutParticipantsInputObjectSchema)]),
  where: z.lazy(() => EventWhereInputObjectSchema).optional()
}).strict();
