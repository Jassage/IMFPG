import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AttendanceWhereUniqueInputObjectSchema } from './AttendanceWhereUniqueInput.schema';
import { AttendanceUpdateWithoutStudentInputObjectSchema } from './AttendanceUpdateWithoutStudentInput.schema';
import { AttendanceUncheckedUpdateWithoutStudentInputObjectSchema } from './AttendanceUncheckedUpdateWithoutStudentInput.schema';
import { AttendanceCreateWithoutStudentInputObjectSchema } from './AttendanceCreateWithoutStudentInput.schema';
import { AttendanceUncheckedCreateWithoutStudentInputObjectSchema } from './AttendanceUncheckedCreateWithoutStudentInput.schema'

export const AttendanceUpsertWithWhereUniqueWithoutStudentInputObjectSchema: z.ZodType<Prisma.AttendanceUpsertWithWhereUniqueWithoutStudentInput, z.ZodTypeDef, Prisma.AttendanceUpsertWithWhereUniqueWithoutStudentInput> = z.object({
  where: z.lazy(() => AttendanceWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => AttendanceUpdateWithoutStudentInputObjectSchema), z.lazy(() => AttendanceUncheckedUpdateWithoutStudentInputObjectSchema)]),
  create: z.union([z.lazy(() => AttendanceCreateWithoutStudentInputObjectSchema), z.lazy(() => AttendanceUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
export const AttendanceUpsertWithWhereUniqueWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => AttendanceWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => AttendanceUpdateWithoutStudentInputObjectSchema), z.lazy(() => AttendanceUncheckedUpdateWithoutStudentInputObjectSchema)]),
  create: z.union([z.lazy(() => AttendanceCreateWithoutStudentInputObjectSchema), z.lazy(() => AttendanceUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
