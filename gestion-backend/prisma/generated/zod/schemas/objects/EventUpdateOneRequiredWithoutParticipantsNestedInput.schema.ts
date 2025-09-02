import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EventCreateWithoutParticipantsInputObjectSchema } from './EventCreateWithoutParticipantsInput.schema';
import { EventUncheckedCreateWithoutParticipantsInputObjectSchema } from './EventUncheckedCreateWithoutParticipantsInput.schema';
import { EventCreateOrConnectWithoutParticipantsInputObjectSchema } from './EventCreateOrConnectWithoutParticipantsInput.schema';
import { EventUpsertWithoutParticipantsInputObjectSchema } from './EventUpsertWithoutParticipantsInput.schema';
import { EventWhereUniqueInputObjectSchema } from './EventWhereUniqueInput.schema';
import { EventUpdateToOneWithWhereWithoutParticipantsInputObjectSchema } from './EventUpdateToOneWithWhereWithoutParticipantsInput.schema';
import { EventUpdateWithoutParticipantsInputObjectSchema } from './EventUpdateWithoutParticipantsInput.schema';
import { EventUncheckedUpdateWithoutParticipantsInputObjectSchema } from './EventUncheckedUpdateWithoutParticipantsInput.schema'

export const EventUpdateOneRequiredWithoutParticipantsNestedInputObjectSchema: z.ZodType<Prisma.EventUpdateOneRequiredWithoutParticipantsNestedInput, z.ZodTypeDef, Prisma.EventUpdateOneRequiredWithoutParticipantsNestedInput> = z.object({
  create: z.union([z.lazy(() => EventCreateWithoutParticipantsInputObjectSchema), z.lazy(() => EventUncheckedCreateWithoutParticipantsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => EventCreateOrConnectWithoutParticipantsInputObjectSchema).optional(),
  upsert: z.lazy(() => EventUpsertWithoutParticipantsInputObjectSchema).optional(),
  connect: z.lazy(() => EventWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => EventUpdateToOneWithWhereWithoutParticipantsInputObjectSchema), z.lazy(() => EventUpdateWithoutParticipantsInputObjectSchema), z.lazy(() => EventUncheckedUpdateWithoutParticipantsInputObjectSchema)]).optional()
}).strict();
export const EventUpdateOneRequiredWithoutParticipantsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => EventCreateWithoutParticipantsInputObjectSchema), z.lazy(() => EventUncheckedCreateWithoutParticipantsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => EventCreateOrConnectWithoutParticipantsInputObjectSchema).optional(),
  upsert: z.lazy(() => EventUpsertWithoutParticipantsInputObjectSchema).optional(),
  connect: z.lazy(() => EventWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => EventUpdateToOneWithWhereWithoutParticipantsInputObjectSchema), z.lazy(() => EventUpdateWithoutParticipantsInputObjectSchema), z.lazy(() => EventUncheckedUpdateWithoutParticipantsInputObjectSchema)]).optional()
}).strict();
