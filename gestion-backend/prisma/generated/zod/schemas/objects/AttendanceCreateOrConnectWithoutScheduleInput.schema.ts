import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AttendanceWhereUniqueInputObjectSchema } from './AttendanceWhereUniqueInput.schema';
import { AttendanceCreateWithoutScheduleInputObjectSchema } from './AttendanceCreateWithoutScheduleInput.schema';
import { AttendanceUncheckedCreateWithoutScheduleInputObjectSchema } from './AttendanceUncheckedCreateWithoutScheduleInput.schema'

export const AttendanceCreateOrConnectWithoutScheduleInputObjectSchema: z.ZodType<Prisma.AttendanceCreateOrConnectWithoutScheduleInput, z.ZodTypeDef, Prisma.AttendanceCreateOrConnectWithoutScheduleInput> = z.object({
  where: z.lazy(() => AttendanceWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AttendanceCreateWithoutScheduleInputObjectSchema), z.lazy(() => AttendanceUncheckedCreateWithoutScheduleInputObjectSchema)])
}).strict();
export const AttendanceCreateOrConnectWithoutScheduleInputObjectZodSchema = z.object({
  where: z.lazy(() => AttendanceWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AttendanceCreateWithoutScheduleInputObjectSchema), z.lazy(() => AttendanceUncheckedCreateWithoutScheduleInputObjectSchema)])
}).strict();
