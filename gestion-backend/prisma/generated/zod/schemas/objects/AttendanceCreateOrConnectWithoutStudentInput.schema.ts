import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AttendanceWhereUniqueInputObjectSchema } from './AttendanceWhereUniqueInput.schema';
import { AttendanceCreateWithoutStudentInputObjectSchema } from './AttendanceCreateWithoutStudentInput.schema';
import { AttendanceUncheckedCreateWithoutStudentInputObjectSchema } from './AttendanceUncheckedCreateWithoutStudentInput.schema'

export const AttendanceCreateOrConnectWithoutStudentInputObjectSchema: z.ZodType<Prisma.AttendanceCreateOrConnectWithoutStudentInput, z.ZodTypeDef, Prisma.AttendanceCreateOrConnectWithoutStudentInput> = z.object({
  where: z.lazy(() => AttendanceWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AttendanceCreateWithoutStudentInputObjectSchema), z.lazy(() => AttendanceUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
export const AttendanceCreateOrConnectWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => AttendanceWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AttendanceCreateWithoutStudentInputObjectSchema), z.lazy(() => AttendanceUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
