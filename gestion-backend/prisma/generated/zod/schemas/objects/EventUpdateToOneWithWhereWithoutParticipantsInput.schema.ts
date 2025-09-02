import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EventWhereInputObjectSchema } from './EventWhereInput.schema';
import { EventUpdateWithoutParticipantsInputObjectSchema } from './EventUpdateWithoutParticipantsInput.schema';
import { EventUncheckedUpdateWithoutParticipantsInputObjectSchema } from './EventUncheckedUpdateWithoutParticipantsInput.schema'

export const EventUpdateToOneWithWhereWithoutParticipantsInputObjectSchema: z.ZodType<Prisma.EventUpdateToOneWithWhereWithoutParticipantsInput, z.ZodTypeDef, Prisma.EventUpdateToOneWithWhereWithoutParticipantsInput> = z.object({
  where: z.lazy(() => EventWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => EventUpdateWithoutParticipantsInputObjectSchema), z.lazy(() => EventUncheckedUpdateWithoutParticipantsInputObjectSchema)])
}).strict();
export const EventUpdateToOneWithWhereWithoutParticipantsInputObjectZodSchema = z.object({
  where: z.lazy(() => EventWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => EventUpdateWithoutParticipantsInputObjectSchema), z.lazy(() => EventUncheckedUpdateWithoutParticipantsInputObjectSchema)])
}).strict();
