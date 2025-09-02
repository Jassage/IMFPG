import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScheduleWhereUniqueInputObjectSchema } from './ScheduleWhereUniqueInput.schema';
import { ScheduleCreateWithoutAttendancesInputObjectSchema } from './ScheduleCreateWithoutAttendancesInput.schema';
import { ScheduleUncheckedCreateWithoutAttendancesInputObjectSchema } from './ScheduleUncheckedCreateWithoutAttendancesInput.schema'

export const ScheduleCreateOrConnectWithoutAttendancesInputObjectSchema: z.ZodType<Prisma.ScheduleCreateOrConnectWithoutAttendancesInput, z.ZodTypeDef, Prisma.ScheduleCreateOrConnectWithoutAttendancesInput> = z.object({
  where: z.lazy(() => ScheduleWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ScheduleCreateWithoutAttendancesInputObjectSchema), z.lazy(() => ScheduleUncheckedCreateWithoutAttendancesInputObjectSchema)])
}).strict();
export const ScheduleCreateOrConnectWithoutAttendancesInputObjectZodSchema = z.object({
  where: z.lazy(() => ScheduleWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ScheduleCreateWithoutAttendancesInputObjectSchema), z.lazy(() => ScheduleUncheckedCreateWithoutAttendancesInputObjectSchema)])
}).strict();
