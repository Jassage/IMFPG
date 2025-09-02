import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AttendanceCreateWithoutScheduleInputObjectSchema } from './AttendanceCreateWithoutScheduleInput.schema';
import { AttendanceUncheckedCreateWithoutScheduleInputObjectSchema } from './AttendanceUncheckedCreateWithoutScheduleInput.schema';
import { AttendanceCreateOrConnectWithoutScheduleInputObjectSchema } from './AttendanceCreateOrConnectWithoutScheduleInput.schema';
import { AttendanceUpsertWithWhereUniqueWithoutScheduleInputObjectSchema } from './AttendanceUpsertWithWhereUniqueWithoutScheduleInput.schema';
import { AttendanceCreateManyScheduleInputEnvelopeObjectSchema } from './AttendanceCreateManyScheduleInputEnvelope.schema';
import { AttendanceWhereUniqueInputObjectSchema } from './AttendanceWhereUniqueInput.schema';
import { AttendanceUpdateWithWhereUniqueWithoutScheduleInputObjectSchema } from './AttendanceUpdateWithWhereUniqueWithoutScheduleInput.schema';
import { AttendanceUpdateManyWithWhereWithoutScheduleInputObjectSchema } from './AttendanceUpdateManyWithWhereWithoutScheduleInput.schema';
import { AttendanceScalarWhereInputObjectSchema } from './AttendanceScalarWhereInput.schema'

export const AttendanceUncheckedUpdateManyWithoutScheduleNestedInputObjectSchema: z.ZodType<Prisma.AttendanceUncheckedUpdateManyWithoutScheduleNestedInput, z.ZodTypeDef, Prisma.AttendanceUncheckedUpdateManyWithoutScheduleNestedInput> = z.object({
  create: z.union([z.lazy(() => AttendanceCreateWithoutScheduleInputObjectSchema), z.lazy(() => AttendanceCreateWithoutScheduleInputObjectSchema).array(), z.lazy(() => AttendanceUncheckedCreateWithoutScheduleInputObjectSchema), z.lazy(() => AttendanceUncheckedCreateWithoutScheduleInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AttendanceCreateOrConnectWithoutScheduleInputObjectSchema), z.lazy(() => AttendanceCreateOrConnectWithoutScheduleInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => AttendanceUpsertWithWhereUniqueWithoutScheduleInputObjectSchema), z.lazy(() => AttendanceUpsertWithWhereUniqueWithoutScheduleInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AttendanceCreateManyScheduleInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => AttendanceWhereUniqueInputObjectSchema), z.lazy(() => AttendanceWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => AttendanceWhereUniqueInputObjectSchema), z.lazy(() => AttendanceWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => AttendanceWhereUniqueInputObjectSchema), z.lazy(() => AttendanceWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => AttendanceWhereUniqueInputObjectSchema), z.lazy(() => AttendanceWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => AttendanceUpdateWithWhereUniqueWithoutScheduleInputObjectSchema), z.lazy(() => AttendanceUpdateWithWhereUniqueWithoutScheduleInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => AttendanceUpdateManyWithWhereWithoutScheduleInputObjectSchema), z.lazy(() => AttendanceUpdateManyWithWhereWithoutScheduleInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => AttendanceScalarWhereInputObjectSchema), z.lazy(() => AttendanceScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const AttendanceUncheckedUpdateManyWithoutScheduleNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => AttendanceCreateWithoutScheduleInputObjectSchema), z.lazy(() => AttendanceCreateWithoutScheduleInputObjectSchema).array(), z.lazy(() => AttendanceUncheckedCreateWithoutScheduleInputObjectSchema), z.lazy(() => AttendanceUncheckedCreateWithoutScheduleInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AttendanceCreateOrConnectWithoutScheduleInputObjectSchema), z.lazy(() => AttendanceCreateOrConnectWithoutScheduleInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => AttendanceUpsertWithWhereUniqueWithoutScheduleInputObjectSchema), z.lazy(() => AttendanceUpsertWithWhereUniqueWithoutScheduleInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AttendanceCreateManyScheduleInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => AttendanceWhereUniqueInputObjectSchema), z.lazy(() => AttendanceWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => AttendanceWhereUniqueInputObjectSchema), z.lazy(() => AttendanceWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => AttendanceWhereUniqueInputObjectSchema), z.lazy(() => AttendanceWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => AttendanceWhereUniqueInputObjectSchema), z.lazy(() => AttendanceWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => AttendanceUpdateWithWhereUniqueWithoutScheduleInputObjectSchema), z.lazy(() => AttendanceUpdateWithWhereUniqueWithoutScheduleInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => AttendanceUpdateManyWithWhereWithoutScheduleInputObjectSchema), z.lazy(() => AttendanceUpdateManyWithWhereWithoutScheduleInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => AttendanceScalarWhereInputObjectSchema), z.lazy(() => AttendanceScalarWhereInputObjectSchema).array()]).optional()
}).strict();
