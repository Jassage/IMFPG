import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScheduleWhereUniqueInputObjectSchema } from './ScheduleWhereUniqueInput.schema';
import { ScheduleUpdateWithoutProfesseurInputObjectSchema } from './ScheduleUpdateWithoutProfesseurInput.schema';
import { ScheduleUncheckedUpdateWithoutProfesseurInputObjectSchema } from './ScheduleUncheckedUpdateWithoutProfesseurInput.schema'

export const ScheduleUpdateWithWhereUniqueWithoutProfesseurInputObjectSchema: z.ZodType<Prisma.ScheduleUpdateWithWhereUniqueWithoutProfesseurInput, z.ZodTypeDef, Prisma.ScheduleUpdateWithWhereUniqueWithoutProfesseurInput> = z.object({
  where: z.lazy(() => ScheduleWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ScheduleUpdateWithoutProfesseurInputObjectSchema), z.lazy(() => ScheduleUncheckedUpdateWithoutProfesseurInputObjectSchema)])
}).strict();
export const ScheduleUpdateWithWhereUniqueWithoutProfesseurInputObjectZodSchema = z.object({
  where: z.lazy(() => ScheduleWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ScheduleUpdateWithoutProfesseurInputObjectSchema), z.lazy(() => ScheduleUncheckedUpdateWithoutProfesseurInputObjectSchema)])
}).strict();
