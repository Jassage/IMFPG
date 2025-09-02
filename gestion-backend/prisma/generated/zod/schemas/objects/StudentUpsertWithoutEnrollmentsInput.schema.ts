import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentUpdateWithoutEnrollmentsInputObjectSchema } from './StudentUpdateWithoutEnrollmentsInput.schema';
import { StudentUncheckedUpdateWithoutEnrollmentsInputObjectSchema } from './StudentUncheckedUpdateWithoutEnrollmentsInput.schema';
import { StudentCreateWithoutEnrollmentsInputObjectSchema } from './StudentCreateWithoutEnrollmentsInput.schema';
import { StudentUncheckedCreateWithoutEnrollmentsInputObjectSchema } from './StudentUncheckedCreateWithoutEnrollmentsInput.schema';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema'

export const StudentUpsertWithoutEnrollmentsInputObjectSchema: z.ZodType<Prisma.StudentUpsertWithoutEnrollmentsInput, z.ZodTypeDef, Prisma.StudentUpsertWithoutEnrollmentsInput> = z.object({
  update: z.union([z.lazy(() => StudentUpdateWithoutEnrollmentsInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutEnrollmentsInputObjectSchema)]),
  create: z.union([z.lazy(() => StudentCreateWithoutEnrollmentsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutEnrollmentsInputObjectSchema)]),
  where: z.lazy(() => StudentWhereInputObjectSchema).optional()
}).strict();
export const StudentUpsertWithoutEnrollmentsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => StudentUpdateWithoutEnrollmentsInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutEnrollmentsInputObjectSchema)]),
  create: z.union([z.lazy(() => StudentCreateWithoutEnrollmentsInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutEnrollmentsInputObjectSchema)]),
  where: z.lazy(() => StudentWhereInputObjectSchema).optional()
}).strict();
