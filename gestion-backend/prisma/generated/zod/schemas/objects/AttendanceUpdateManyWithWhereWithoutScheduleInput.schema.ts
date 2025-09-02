import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AttendanceScalarWhereInputObjectSchema } from './AttendanceScalarWhereInput.schema';
import { AttendanceUpdateManyMutationInputObjectSchema } from './AttendanceUpdateManyMutationInput.schema';
import { AttendanceUncheckedUpdateManyWithoutScheduleInputObjectSchema } from './AttendanceUncheckedUpdateManyWithoutScheduleInput.schema'

export const AttendanceUpdateManyWithWhereWithoutScheduleInputObjectSchema: z.ZodType<Prisma.AttendanceUpdateManyWithWhereWithoutScheduleInput, z.ZodTypeDef, Prisma.AttendanceUpdateManyWithWhereWithoutScheduleInput> = z.object({
  where: z.lazy(() => AttendanceScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => AttendanceUpdateManyMutationInputObjectSchema), z.lazy(() => AttendanceUncheckedUpdateManyWithoutScheduleInputObjectSchema)])
}).strict();
export const AttendanceUpdateManyWithWhereWithoutScheduleInputObjectZodSchema = z.object({
  where: z.lazy(() => AttendanceScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => AttendanceUpdateManyMutationInputObjectSchema), z.lazy(() => AttendanceUncheckedUpdateManyWithoutScheduleInputObjectSchema)])
}).strict();
