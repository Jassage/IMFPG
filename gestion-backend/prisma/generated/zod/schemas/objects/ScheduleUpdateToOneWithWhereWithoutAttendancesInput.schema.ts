import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScheduleWhereInputObjectSchema } from './ScheduleWhereInput.schema';
import { ScheduleUpdateWithoutAttendancesInputObjectSchema } from './ScheduleUpdateWithoutAttendancesInput.schema';
import { ScheduleUncheckedUpdateWithoutAttendancesInputObjectSchema } from './ScheduleUncheckedUpdateWithoutAttendancesInput.schema'

export const ScheduleUpdateToOneWithWhereWithoutAttendancesInputObjectSchema: z.ZodType<Prisma.ScheduleUpdateToOneWithWhereWithoutAttendancesInput, z.ZodTypeDef, Prisma.ScheduleUpdateToOneWithWhereWithoutAttendancesInput> = z.object({
  where: z.lazy(() => ScheduleWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ScheduleUpdateWithoutAttendancesInputObjectSchema), z.lazy(() => ScheduleUncheckedUpdateWithoutAttendancesInputObjectSchema)])
}).strict();
export const ScheduleUpdateToOneWithWhereWithoutAttendancesInputObjectZodSchema = z.object({
  where: z.lazy(() => ScheduleWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ScheduleUpdateWithoutAttendancesInputObjectSchema), z.lazy(() => ScheduleUncheckedUpdateWithoutAttendancesInputObjectSchema)])
}).strict();
