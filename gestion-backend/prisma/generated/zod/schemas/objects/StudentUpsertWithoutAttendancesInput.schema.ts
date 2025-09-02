import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentUpdateWithoutAttendancesInputObjectSchema } from './StudentUpdateWithoutAttendancesInput.schema';
import { StudentUncheckedUpdateWithoutAttendancesInputObjectSchema } from './StudentUncheckedUpdateWithoutAttendancesInput.schema';
import { StudentCreateWithoutAttendancesInputObjectSchema } from './StudentCreateWithoutAttendancesInput.schema';
import { StudentUncheckedCreateWithoutAttendancesInputObjectSchema } from './StudentUncheckedCreateWithoutAttendancesInput.schema';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema'

export const StudentUpsertWithoutAttendancesInputObjectSchema: z.ZodType<Prisma.StudentUpsertWithoutAttendancesInput, z.ZodTypeDef, Prisma.StudentUpsertWithoutAttendancesInput> = z.object({
  update: z.union([z.lazy(() => StudentUpdateWithoutAttendancesInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutAttendancesInputObjectSchema)]),
  create: z.union([z.lazy(() => StudentCreateWithoutAttendancesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutAttendancesInputObjectSchema)]),
  where: z.lazy(() => StudentWhereInputObjectSchema).optional()
}).strict();
export const StudentUpsertWithoutAttendancesInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => StudentUpdateWithoutAttendancesInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutAttendancesInputObjectSchema)]),
  create: z.union([z.lazy(() => StudentCreateWithoutAttendancesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutAttendancesInputObjectSchema)]),
  where: z.lazy(() => StudentWhereInputObjectSchema).optional()
}).strict();
