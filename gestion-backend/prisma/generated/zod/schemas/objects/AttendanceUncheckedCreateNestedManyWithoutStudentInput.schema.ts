import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AttendanceCreateWithoutStudentInputObjectSchema } from './AttendanceCreateWithoutStudentInput.schema';
import { AttendanceUncheckedCreateWithoutStudentInputObjectSchema } from './AttendanceUncheckedCreateWithoutStudentInput.schema';
import { AttendanceCreateOrConnectWithoutStudentInputObjectSchema } from './AttendanceCreateOrConnectWithoutStudentInput.schema';
import { AttendanceCreateManyStudentInputEnvelopeObjectSchema } from './AttendanceCreateManyStudentInputEnvelope.schema';
import { AttendanceWhereUniqueInputObjectSchema } from './AttendanceWhereUniqueInput.schema'

export const AttendanceUncheckedCreateNestedManyWithoutStudentInputObjectSchema: z.ZodType<Prisma.AttendanceUncheckedCreateNestedManyWithoutStudentInput, z.ZodTypeDef, Prisma.AttendanceUncheckedCreateNestedManyWithoutStudentInput> = z.object({
  create: z.union([z.lazy(() => AttendanceCreateWithoutStudentInputObjectSchema), z.lazy(() => AttendanceCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => AttendanceUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => AttendanceUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AttendanceCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => AttendanceCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AttendanceCreateManyStudentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => AttendanceWhereUniqueInputObjectSchema), z.lazy(() => AttendanceWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const AttendanceUncheckedCreateNestedManyWithoutStudentInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => AttendanceCreateWithoutStudentInputObjectSchema), z.lazy(() => AttendanceCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => AttendanceUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => AttendanceUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AttendanceCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => AttendanceCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AttendanceCreateManyStudentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => AttendanceWhereUniqueInputObjectSchema), z.lazy(() => AttendanceWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
