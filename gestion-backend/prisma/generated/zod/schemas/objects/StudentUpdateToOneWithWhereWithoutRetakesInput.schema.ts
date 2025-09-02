import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema';
import { StudentUpdateWithoutRetakesInputObjectSchema } from './StudentUpdateWithoutRetakesInput.schema';
import { StudentUncheckedUpdateWithoutRetakesInputObjectSchema } from './StudentUncheckedUpdateWithoutRetakesInput.schema'

export const StudentUpdateToOneWithWhereWithoutRetakesInputObjectSchema: z.ZodType<Prisma.StudentUpdateToOneWithWhereWithoutRetakesInput, z.ZodTypeDef, Prisma.StudentUpdateToOneWithWhereWithoutRetakesInput> = z.object({
  where: z.lazy(() => StudentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => StudentUpdateWithoutRetakesInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutRetakesInputObjectSchema)])
}).strict();
export const StudentUpdateToOneWithWhereWithoutRetakesInputObjectZodSchema = z.object({
  where: z.lazy(() => StudentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => StudentUpdateWithoutRetakesInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutRetakesInputObjectSchema)])
}).strict();
