import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema';
import { StudentUpdateWithoutAttendancesInputObjectSchema } from './StudentUpdateWithoutAttendancesInput.schema';
import { StudentUncheckedUpdateWithoutAttendancesInputObjectSchema } from './StudentUncheckedUpdateWithoutAttendancesInput.schema'

export const StudentUpdateToOneWithWhereWithoutAttendancesInputObjectSchema: z.ZodType<Prisma.StudentUpdateToOneWithWhereWithoutAttendancesInput, z.ZodTypeDef, Prisma.StudentUpdateToOneWithWhereWithoutAttendancesInput> = z.object({
  where: z.lazy(() => StudentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => StudentUpdateWithoutAttendancesInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutAttendancesInputObjectSchema)])
}).strict();
export const StudentUpdateToOneWithWhereWithoutAttendancesInputObjectZodSchema = z.object({
  where: z.lazy(() => StudentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => StudentUpdateWithoutAttendancesInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutAttendancesInputObjectSchema)])
}).strict();
