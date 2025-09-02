import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScheduleScalarWhereInputObjectSchema } from './ScheduleScalarWhereInput.schema';
import { ScheduleUpdateManyMutationInputObjectSchema } from './ScheduleUpdateManyMutationInput.schema';
import { ScheduleUncheckedUpdateManyWithoutProfesseurInputObjectSchema } from './ScheduleUncheckedUpdateManyWithoutProfesseurInput.schema'

export const ScheduleUpdateManyWithWhereWithoutProfesseurInputObjectSchema: z.ZodType<Prisma.ScheduleUpdateManyWithWhereWithoutProfesseurInput, z.ZodTypeDef, Prisma.ScheduleUpdateManyWithWhereWithoutProfesseurInput> = z.object({
  where: z.lazy(() => ScheduleScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ScheduleUpdateManyMutationInputObjectSchema), z.lazy(() => ScheduleUncheckedUpdateManyWithoutProfesseurInputObjectSchema)])
}).strict();
export const ScheduleUpdateManyWithWhereWithoutProfesseurInputObjectZodSchema = z.object({
  where: z.lazy(() => ScheduleScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ScheduleUpdateManyMutationInputObjectSchema), z.lazy(() => ScheduleUncheckedUpdateManyWithoutProfesseurInputObjectSchema)])
}).strict();
