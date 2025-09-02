import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentUpdateWithoutGradesInputObjectSchema } from './StudentUpdateWithoutGradesInput.schema';
import { StudentUncheckedUpdateWithoutGradesInputObjectSchema } from './StudentUncheckedUpdateWithoutGradesInput.schema';
import { StudentCreateWithoutGradesInputObjectSchema } from './StudentCreateWithoutGradesInput.schema';
import { StudentUncheckedCreateWithoutGradesInputObjectSchema } from './StudentUncheckedCreateWithoutGradesInput.schema';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema'

export const StudentUpsertWithoutGradesInputObjectSchema: z.ZodType<Prisma.StudentUpsertWithoutGradesInput, z.ZodTypeDef, Prisma.StudentUpsertWithoutGradesInput> = z.object({
  update: z.union([z.lazy(() => StudentUpdateWithoutGradesInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutGradesInputObjectSchema)]),
  create: z.union([z.lazy(() => StudentCreateWithoutGradesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutGradesInputObjectSchema)]),
  where: z.lazy(() => StudentWhereInputObjectSchema).optional()
}).strict();
export const StudentUpsertWithoutGradesInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => StudentUpdateWithoutGradesInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutGradesInputObjectSchema)]),
  create: z.union([z.lazy(() => StudentCreateWithoutGradesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutGradesInputObjectSchema)]),
  where: z.lazy(() => StudentWhereInputObjectSchema).optional()
}).strict();
