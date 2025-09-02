import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentUpdateWithoutRetakesInputObjectSchema } from './StudentUpdateWithoutRetakesInput.schema';
import { StudentUncheckedUpdateWithoutRetakesInputObjectSchema } from './StudentUncheckedUpdateWithoutRetakesInput.schema';
import { StudentCreateWithoutRetakesInputObjectSchema } from './StudentCreateWithoutRetakesInput.schema';
import { StudentUncheckedCreateWithoutRetakesInputObjectSchema } from './StudentUncheckedCreateWithoutRetakesInput.schema';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema'

export const StudentUpsertWithoutRetakesInputObjectSchema: z.ZodType<Prisma.StudentUpsertWithoutRetakesInput, z.ZodTypeDef, Prisma.StudentUpsertWithoutRetakesInput> = z.object({
  update: z.union([z.lazy(() => StudentUpdateWithoutRetakesInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutRetakesInputObjectSchema)]),
  create: z.union([z.lazy(() => StudentCreateWithoutRetakesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutRetakesInputObjectSchema)]),
  where: z.lazy(() => StudentWhereInputObjectSchema).optional()
}).strict();
export const StudentUpsertWithoutRetakesInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => StudentUpdateWithoutRetakesInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutRetakesInputObjectSchema)]),
  create: z.union([z.lazy(() => StudentCreateWithoutRetakesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutRetakesInputObjectSchema)]),
  where: z.lazy(() => StudentWhereInputObjectSchema).optional()
}).strict();
