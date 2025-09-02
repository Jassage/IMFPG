import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateWithoutAttendancesInputObjectSchema } from './StudentCreateWithoutAttendancesInput.schema';
import { StudentUncheckedCreateWithoutAttendancesInputObjectSchema } from './StudentUncheckedCreateWithoutAttendancesInput.schema';
import { StudentCreateOrConnectWithoutAttendancesInputObjectSchema } from './StudentCreateOrConnectWithoutAttendancesInput.schema';
import { StudentUpsertWithoutAttendancesInputObjectSchema } from './StudentUpsertWithoutAttendancesInput.schema';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema';
import { StudentUpdateToOneWithWhereWithoutAttendancesInputObjectSchema } from './StudentUpdateToOneWithWhereWithoutAttendancesInput.schema';
import { StudentUpdateWithoutAttendancesInputObjectSchema } from './StudentUpdateWithoutAttendancesInput.schema';
import { StudentUncheckedUpdateWithoutAttendancesInputObjectSchema } from './StudentUncheckedUpdateWithoutAttendancesInput.schema'

export const StudentUpdateOneRequiredWithoutAttendancesNestedInputObjectSchema: z.ZodType<Prisma.StudentUpdateOneRequiredWithoutAttendancesNestedInput, z.ZodTypeDef, Prisma.StudentUpdateOneRequiredWithoutAttendancesNestedInput> = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutAttendancesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutAttendancesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutAttendancesInputObjectSchema).optional(),
  upsert: z.lazy(() => StudentUpsertWithoutAttendancesInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => StudentUpdateToOneWithWhereWithoutAttendancesInputObjectSchema), z.lazy(() => StudentUpdateWithoutAttendancesInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutAttendancesInputObjectSchema)]).optional()
}).strict();
export const StudentUpdateOneRequiredWithoutAttendancesNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutAttendancesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutAttendancesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutAttendancesInputObjectSchema).optional(),
  upsert: z.lazy(() => StudentUpsertWithoutAttendancesInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => StudentUpdateToOneWithWhereWithoutAttendancesInputObjectSchema), z.lazy(() => StudentUpdateWithoutAttendancesInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutAttendancesInputObjectSchema)]).optional()
}).strict();
