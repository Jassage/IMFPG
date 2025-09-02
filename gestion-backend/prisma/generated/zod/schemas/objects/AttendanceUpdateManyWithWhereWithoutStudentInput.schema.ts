import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AttendanceScalarWhereInputObjectSchema } from './AttendanceScalarWhereInput.schema';
import { AttendanceUpdateManyMutationInputObjectSchema } from './AttendanceUpdateManyMutationInput.schema';
import { AttendanceUncheckedUpdateManyWithoutStudentInputObjectSchema } from './AttendanceUncheckedUpdateManyWithoutStudentInput.schema'

export const AttendanceUpdateManyWithWhereWithoutStudentInputObjectSchema: z.ZodType<Prisma.AttendanceUpdateManyWithWhereWithoutStudentInput, z.ZodTypeDef, Prisma.AttendanceUpdateManyWithWhereWithoutStudentInput> = z.object({
  where: z.lazy(() => AttendanceScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => AttendanceUpdateManyMutationInputObjectSchema), z.lazy(() => AttendanceUncheckedUpdateManyWithoutStudentInputObjectSchema)])
}).strict();
export const AttendanceUpdateManyWithWhereWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => AttendanceScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => AttendanceUpdateManyMutationInputObjectSchema), z.lazy(() => AttendanceUncheckedUpdateManyWithoutStudentInputObjectSchema)])
}).strict();
