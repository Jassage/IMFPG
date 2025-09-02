import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentUpdateWithoutPaymentsInputObjectSchema } from './StudentUpdateWithoutPaymentsInput.schema';
import { StudentUncheckedUpdateWithoutPaymentsInputObjectSchema } from './StudentUncheckedUpdateWithoutPaymentsInput.schema';
import { StudentCreateWithoutPaymentsInputObjectSchema } from './StudentCreateWithoutPaymentsInput.schema';
import { StudentUncheckedCreateWithoutPaymentsInputObjectSchema } from './StudentUncheckedCreateWithoutPaymentsInput.schema';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema'

export const StudentUpsertWithoutPaymentsInputObjectSchema: z.ZodType<Prisma.StudentUpsertWithoutPaymentsInput, z.ZodTypeDef, Prisma.StudentUpsertWithoutPaymentsInput> = z.object({
  update: z.union([z.lazy(() => StudentUpdateWithoutPaymentsInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutPaymentsInputObjectSchema)]),
  create: z.union([z.lazy(() => StudentCreateWithoutPaymentsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutPaymentsInputObjectSchema)]),
  where: z.lazy(() => StudentWhereInputObjectSchema).optional()
}).strict();
export const StudentUpsertWithoutPaymentsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => StudentUpdateWithoutPaymentsInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutPaymentsInputObjectSchema)]),
  create: z.union([z.lazy(() => StudentCreateWithoutPaymentsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutPaymentsInputObjectSchema)]),
  where: z.lazy(() => StudentWhereInputObjectSchema).optional()
}).strict();
