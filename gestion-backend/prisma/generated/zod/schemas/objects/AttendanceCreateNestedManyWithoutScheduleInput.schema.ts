import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AttendanceCreateWithoutScheduleInputObjectSchema } from './AttendanceCreateWithoutScheduleInput.schema';
import { AttendanceUncheckedCreateWithoutScheduleInputObjectSchema } from './AttendanceUncheckedCreateWithoutScheduleInput.schema';
import { AttendanceCreateOrConnectWithoutScheduleInputObjectSchema } from './AttendanceCreateOrConnectWithoutScheduleInput.schema';
import { AttendanceCreateManyScheduleInputEnvelopeObjectSchema } from './AttendanceCreateManyScheduleInputEnvelope.schema';
import { AttendanceWhereUniqueInputObjectSchema } from './AttendanceWhereUniqueInput.schema'

export const AttendanceCreateNestedManyWithoutScheduleInputObjectSchema: z.ZodType<Prisma.AttendanceCreateNestedManyWithoutScheduleInput, z.ZodTypeDef, Prisma.AttendanceCreateNestedManyWithoutScheduleInput> = z.object({
  create: z.union([z.lazy(() => AttendanceCreateWithoutScheduleInputObjectSchema), z.lazy(() => AttendanceCreateWithoutScheduleInputObjectSchema).array(), z.lazy(() => AttendanceUncheckedCreateWithoutScheduleInputObjectSchema), z.lazy(() => AttendanceUncheckedCreateWithoutScheduleInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AttendanceCreateOrConnectWithoutScheduleInputObjectSchema), z.lazy(() => AttendanceCreateOrConnectWithoutScheduleInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AttendanceCreateManyScheduleInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => AttendanceWhereUniqueInputObjectSchema), z.lazy(() => AttendanceWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const AttendanceCreateNestedManyWithoutScheduleInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => AttendanceCreateWithoutScheduleInputObjectSchema), z.lazy(() => AttendanceCreateWithoutScheduleInputObjectSchema).array(), z.lazy(() => AttendanceUncheckedCreateWithoutScheduleInputObjectSchema), z.lazy(() => AttendanceUncheckedCreateWithoutScheduleInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AttendanceCreateOrConnectWithoutScheduleInputObjectSchema), z.lazy(() => AttendanceCreateOrConnectWithoutScheduleInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AttendanceCreateManyScheduleInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => AttendanceWhereUniqueInputObjectSchema), z.lazy(() => AttendanceWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
