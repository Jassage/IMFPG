import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema';
import { StudentUpdateWithoutEnrollmentsInputObjectSchema } from './StudentUpdateWithoutEnrollmentsInput.schema';
import { StudentUncheckedUpdateWithoutEnrollmentsInputObjectSchema } from './StudentUncheckedUpdateWithoutEnrollmentsInput.schema'

export const StudentUpdateToOneWithWhereWithoutEnrollmentsInputObjectSchema: z.ZodType<Prisma.StudentUpdateToOneWithWhereWithoutEnrollmentsInput, z.ZodTypeDef, Prisma.StudentUpdateToOneWithWhereWithoutEnrollmentsInput> = z.object({
  where: z.lazy(() => StudentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => StudentUpdateWithoutEnrollmentsInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutEnrollmentsInputObjectSchema)])
}).strict();
export const StudentUpdateToOneWithWhereWithoutEnrollmentsInputObjectZodSchema = z.object({
  where: z.lazy(() => StudentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => StudentUpdateWithoutEnrollmentsInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutEnrollmentsInputObjectSchema)])
}).strict();
