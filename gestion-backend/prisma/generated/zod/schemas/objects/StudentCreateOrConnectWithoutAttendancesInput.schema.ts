import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema';
import { StudentCreateWithoutAttendancesInputObjectSchema } from './StudentCreateWithoutAttendancesInput.schema';
import { StudentUncheckedCreateWithoutAttendancesInputObjectSchema } from './StudentUncheckedCreateWithoutAttendancesInput.schema'

export const StudentCreateOrConnectWithoutAttendancesInputObjectSchema: z.ZodType<Prisma.StudentCreateOrConnectWithoutAttendancesInput, z.ZodTypeDef, Prisma.StudentCreateOrConnectWithoutAttendancesInput> = z.object({
  where: z.lazy(() => StudentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => StudentCreateWithoutAttendancesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutAttendancesInputObjectSchema)])
}).strict();
export const StudentCreateOrConnectWithoutAttendancesInputObjectZodSchema = z.object({
  where: z.lazy(() => StudentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => StudentCreateWithoutAttendancesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutAttendancesInputObjectSchema)])
}).strict();
