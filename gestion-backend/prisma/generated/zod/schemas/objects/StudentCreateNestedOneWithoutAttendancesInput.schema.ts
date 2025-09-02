import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateWithoutAttendancesInputObjectSchema } from './StudentCreateWithoutAttendancesInput.schema';
import { StudentUncheckedCreateWithoutAttendancesInputObjectSchema } from './StudentUncheckedCreateWithoutAttendancesInput.schema';
import { StudentCreateOrConnectWithoutAttendancesInputObjectSchema } from './StudentCreateOrConnectWithoutAttendancesInput.schema';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema'

export const StudentCreateNestedOneWithoutAttendancesInputObjectSchema: z.ZodType<Prisma.StudentCreateNestedOneWithoutAttendancesInput, z.ZodTypeDef, Prisma.StudentCreateNestedOneWithoutAttendancesInput> = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutAttendancesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutAttendancesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutAttendancesInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional()
}).strict();
export const StudentCreateNestedOneWithoutAttendancesInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutAttendancesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutAttendancesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutAttendancesInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional()
}).strict();
