import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScheduleWhereUniqueInputObjectSchema } from './ScheduleWhereUniqueInput.schema';
import { ScheduleUpdateWithoutProfesseurInputObjectSchema } from './ScheduleUpdateWithoutProfesseurInput.schema';
import { ScheduleUncheckedUpdateWithoutProfesseurInputObjectSchema } from './ScheduleUncheckedUpdateWithoutProfesseurInput.schema';
import { ScheduleCreateWithoutProfesseurInputObjectSchema } from './ScheduleCreateWithoutProfesseurInput.schema';
import { ScheduleUncheckedCreateWithoutProfesseurInputObjectSchema } from './ScheduleUncheckedCreateWithoutProfesseurInput.schema'

export const ScheduleUpsertWithWhereUniqueWithoutProfesseurInputObjectSchema: z.ZodType<Prisma.ScheduleUpsertWithWhereUniqueWithoutProfesseurInput, z.ZodTypeDef, Prisma.ScheduleUpsertWithWhereUniqueWithoutProfesseurInput> = z.object({
  where: z.lazy(() => ScheduleWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ScheduleUpdateWithoutProfesseurInputObjectSchema), z.lazy(() => ScheduleUncheckedUpdateWithoutProfesseurInputObjectSchema)]),
  create: z.union([z.lazy(() => ScheduleCreateWithoutProfesseurInputObjectSchema), z.lazy(() => ScheduleUncheckedCreateWithoutProfesseurInputObjectSchema)])
}).strict();
export const ScheduleUpsertWithWhereUniqueWithoutProfesseurInputObjectZodSchema = z.object({
  where: z.lazy(() => ScheduleWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ScheduleUpdateWithoutProfesseurInputObjectSchema), z.lazy(() => ScheduleUncheckedUpdateWithoutProfesseurInputObjectSchema)]),
  create: z.union([z.lazy(() => ScheduleCreateWithoutProfesseurInputObjectSchema), z.lazy(() => ScheduleUncheckedCreateWithoutProfesseurInputObjectSchema)])
}).strict();
