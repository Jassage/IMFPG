import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AttendanceWhereUniqueInputObjectSchema } from './AttendanceWhereUniqueInput.schema';
import { AttendanceUpdateWithoutScheduleInputObjectSchema } from './AttendanceUpdateWithoutScheduleInput.schema';
import { AttendanceUncheckedUpdateWithoutScheduleInputObjectSchema } from './AttendanceUncheckedUpdateWithoutScheduleInput.schema';
import { AttendanceCreateWithoutScheduleInputObjectSchema } from './AttendanceCreateWithoutScheduleInput.schema';
import { AttendanceUncheckedCreateWithoutScheduleInputObjectSchema } from './AttendanceUncheckedCreateWithoutScheduleInput.schema'

export const AttendanceUpsertWithWhereUniqueWithoutScheduleInputObjectSchema: z.ZodType<Prisma.AttendanceUpsertWithWhereUniqueWithoutScheduleInput, z.ZodTypeDef, Prisma.AttendanceUpsertWithWhereUniqueWithoutScheduleInput> = z.object({
  where: z.lazy(() => AttendanceWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => AttendanceUpdateWithoutScheduleInputObjectSchema), z.lazy(() => AttendanceUncheckedUpdateWithoutScheduleInputObjectSchema)]),
  create: z.union([z.lazy(() => AttendanceCreateWithoutScheduleInputObjectSchema), z.lazy(() => AttendanceUncheckedCreateWithoutScheduleInputObjectSchema)])
}).strict();
export const AttendanceUpsertWithWhereUniqueWithoutScheduleInputObjectZodSchema = z.object({
  where: z.lazy(() => AttendanceWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => AttendanceUpdateWithoutScheduleInputObjectSchema), z.lazy(() => AttendanceUncheckedUpdateWithoutScheduleInputObjectSchema)]),
  create: z.union([z.lazy(() => AttendanceCreateWithoutScheduleInputObjectSchema), z.lazy(() => AttendanceUncheckedCreateWithoutScheduleInputObjectSchema)])
}).strict();
