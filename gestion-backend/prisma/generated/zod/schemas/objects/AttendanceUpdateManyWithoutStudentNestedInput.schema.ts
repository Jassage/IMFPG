import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AttendanceCreateWithoutStudentInputObjectSchema } from './AttendanceCreateWithoutStudentInput.schema';
import { AttendanceUncheckedCreateWithoutStudentInputObjectSchema } from './AttendanceUncheckedCreateWithoutStudentInput.schema';
import { AttendanceCreateOrConnectWithoutStudentInputObjectSchema } from './AttendanceCreateOrConnectWithoutStudentInput.schema';
import { AttendanceUpsertWithWhereUniqueWithoutStudentInputObjectSchema } from './AttendanceUpsertWithWhereUniqueWithoutStudentInput.schema';
import { AttendanceCreateManyStudentInputEnvelopeObjectSchema } from './AttendanceCreateManyStudentInputEnvelope.schema';
import { AttendanceWhereUniqueInputObjectSchema } from './AttendanceWhereUniqueInput.schema';
import { AttendanceUpdateWithWhereUniqueWithoutStudentInputObjectSchema } from './AttendanceUpdateWithWhereUniqueWithoutStudentInput.schema';
import { AttendanceUpdateManyWithWhereWithoutStudentInputObjectSchema } from './AttendanceUpdateManyWithWhereWithoutStudentInput.schema';
import { AttendanceScalarWhereInputObjectSchema } from './AttendanceScalarWhereInput.schema'

export const AttendanceUpdateManyWithoutStudentNestedInputObjectSchema: z.ZodType<Prisma.AttendanceUpdateManyWithoutStudentNestedInput, z.ZodTypeDef, Prisma.AttendanceUpdateManyWithoutStudentNestedInput> = z.object({
  create: z.union([z.lazy(() => AttendanceCreateWithoutStudentInputObjectSchema), z.lazy(() => AttendanceCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => AttendanceUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => AttendanceUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AttendanceCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => AttendanceCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => AttendanceUpsertWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => AttendanceUpsertWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AttendanceCreateManyStudentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => AttendanceWhereUniqueInputObjectSchema), z.lazy(() => AttendanceWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => AttendanceWhereUniqueInputObjectSchema), z.lazy(() => AttendanceWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => AttendanceWhereUniqueInputObjectSchema), z.lazy(() => AttendanceWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => AttendanceWhereUniqueInputObjectSchema), z.lazy(() => AttendanceWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => AttendanceUpdateWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => AttendanceUpdateWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => AttendanceUpdateManyWithWhereWithoutStudentInputObjectSchema), z.lazy(() => AttendanceUpdateManyWithWhereWithoutStudentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => AttendanceScalarWhereInputObjectSchema), z.lazy(() => AttendanceScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const AttendanceUpdateManyWithoutStudentNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => AttendanceCreateWithoutStudentInputObjectSchema), z.lazy(() => AttendanceCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => AttendanceUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => AttendanceUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AttendanceCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => AttendanceCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => AttendanceUpsertWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => AttendanceUpsertWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AttendanceCreateManyStudentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => AttendanceWhereUniqueInputObjectSchema), z.lazy(() => AttendanceWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => AttendanceWhereUniqueInputObjectSchema), z.lazy(() => AttendanceWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => AttendanceWhereUniqueInputObjectSchema), z.lazy(() => AttendanceWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => AttendanceWhereUniqueInputObjectSchema), z.lazy(() => AttendanceWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => AttendanceUpdateWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => AttendanceUpdateWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => AttendanceUpdateManyWithWhereWithoutStudentInputObjectSchema), z.lazy(() => AttendanceUpdateManyWithWhereWithoutStudentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => AttendanceScalarWhereInputObjectSchema), z.lazy(() => AttendanceScalarWhereInputObjectSchema).array()]).optional()
}).strict();
