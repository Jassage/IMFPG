import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AttendanceWhereUniqueInputObjectSchema } from './AttendanceWhereUniqueInput.schema';
import { AttendanceUpdateWithoutScheduleInputObjectSchema } from './AttendanceUpdateWithoutScheduleInput.schema';
import { AttendanceUncheckedUpdateWithoutScheduleInputObjectSchema } from './AttendanceUncheckedUpdateWithoutScheduleInput.schema'

export const AttendanceUpdateWithWhereUniqueWithoutScheduleInputObjectSchema: z.ZodType<Prisma.AttendanceUpdateWithWhereUniqueWithoutScheduleInput, z.ZodTypeDef, Prisma.AttendanceUpdateWithWhereUniqueWithoutScheduleInput> = z.object({
  where: z.lazy(() => AttendanceWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => AttendanceUpdateWithoutScheduleInputObjectSchema), z.lazy(() => AttendanceUncheckedUpdateWithoutScheduleInputObjectSchema)])
}).strict();
export const AttendanceUpdateWithWhereUniqueWithoutScheduleInputObjectZodSchema = z.object({
  where: z.lazy(() => AttendanceWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => AttendanceUpdateWithoutScheduleInputObjectSchema), z.lazy(() => AttendanceUncheckedUpdateWithoutScheduleInputObjectSchema)])
}).strict();
