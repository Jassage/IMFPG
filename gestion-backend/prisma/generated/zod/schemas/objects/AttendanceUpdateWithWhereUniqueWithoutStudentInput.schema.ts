import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AttendanceWhereUniqueInputObjectSchema } from './AttendanceWhereUniqueInput.schema';
import { AttendanceUpdateWithoutStudentInputObjectSchema } from './AttendanceUpdateWithoutStudentInput.schema';
import { AttendanceUncheckedUpdateWithoutStudentInputObjectSchema } from './AttendanceUncheckedUpdateWithoutStudentInput.schema'

export const AttendanceUpdateWithWhereUniqueWithoutStudentInputObjectSchema: z.ZodType<Prisma.AttendanceUpdateWithWhereUniqueWithoutStudentInput, z.ZodTypeDef, Prisma.AttendanceUpdateWithWhereUniqueWithoutStudentInput> = z.object({
  where: z.lazy(() => AttendanceWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => AttendanceUpdateWithoutStudentInputObjectSchema), z.lazy(() => AttendanceUncheckedUpdateWithoutStudentInputObjectSchema)])
}).strict();
export const AttendanceUpdateWithWhereUniqueWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => AttendanceWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => AttendanceUpdateWithoutStudentInputObjectSchema), z.lazy(() => AttendanceUncheckedUpdateWithoutStudentInputObjectSchema)])
}).strict();
