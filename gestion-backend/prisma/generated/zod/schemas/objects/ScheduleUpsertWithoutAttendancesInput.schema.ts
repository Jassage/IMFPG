import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScheduleUpdateWithoutAttendancesInputObjectSchema } from './ScheduleUpdateWithoutAttendancesInput.schema';
import { ScheduleUncheckedUpdateWithoutAttendancesInputObjectSchema } from './ScheduleUncheckedUpdateWithoutAttendancesInput.schema';
import { ScheduleCreateWithoutAttendancesInputObjectSchema } from './ScheduleCreateWithoutAttendancesInput.schema';
import { ScheduleUncheckedCreateWithoutAttendancesInputObjectSchema } from './ScheduleUncheckedCreateWithoutAttendancesInput.schema';
import { ScheduleWhereInputObjectSchema } from './ScheduleWhereInput.schema'

export const ScheduleUpsertWithoutAttendancesInputObjectSchema: z.ZodType<Prisma.ScheduleUpsertWithoutAttendancesInput, z.ZodTypeDef, Prisma.ScheduleUpsertWithoutAttendancesInput> = z.object({
  update: z.union([z.lazy(() => ScheduleUpdateWithoutAttendancesInputObjectSchema), z.lazy(() => ScheduleUncheckedUpdateWithoutAttendancesInputObjectSchema)]),
  create: z.union([z.lazy(() => ScheduleCreateWithoutAttendancesInputObjectSchema), z.lazy(() => ScheduleUncheckedCreateWithoutAttendancesInputObjectSchema)]),
  where: z.lazy(() => ScheduleWhereInputObjectSchema).optional()
}).strict();
export const ScheduleUpsertWithoutAttendancesInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => ScheduleUpdateWithoutAttendancesInputObjectSchema), z.lazy(() => ScheduleUncheckedUpdateWithoutAttendancesInputObjectSchema)]),
  create: z.union([z.lazy(() => ScheduleCreateWithoutAttendancesInputObjectSchema), z.lazy(() => ScheduleUncheckedCreateWithoutAttendancesInputObjectSchema)]),
  where: z.lazy(() => ScheduleWhereInputObjectSchema).optional()
}).strict();
