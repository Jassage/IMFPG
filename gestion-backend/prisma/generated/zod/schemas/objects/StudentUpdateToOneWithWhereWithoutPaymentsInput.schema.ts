import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema';
import { StudentUpdateWithoutPaymentsInputObjectSchema } from './StudentUpdateWithoutPaymentsInput.schema';
import { StudentUncheckedUpdateWithoutPaymentsInputObjectSchema } from './StudentUncheckedUpdateWithoutPaymentsInput.schema'

export const StudentUpdateToOneWithWhereWithoutPaymentsInputObjectSchema: z.ZodType<Prisma.StudentUpdateToOneWithWhereWithoutPaymentsInput, z.ZodTypeDef, Prisma.StudentUpdateToOneWithWhereWithoutPaymentsInput> = z.object({
  where: z.lazy(() => StudentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => StudentUpdateWithoutPaymentsInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutPaymentsInputObjectSchema)])
}).strict();
export const StudentUpdateToOneWithWhereWithoutPaymentsInputObjectZodSchema = z.object({
  where: z.lazy(() => StudentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => StudentUpdateWithoutPaymentsInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutPaymentsInputObjectSchema)])
}).strict();
