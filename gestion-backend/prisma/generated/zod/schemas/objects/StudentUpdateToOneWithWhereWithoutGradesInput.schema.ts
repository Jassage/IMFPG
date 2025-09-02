import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema';
import { StudentUpdateWithoutGradesInputObjectSchema } from './StudentUpdateWithoutGradesInput.schema';
import { StudentUncheckedUpdateWithoutGradesInputObjectSchema } from './StudentUncheckedUpdateWithoutGradesInput.schema'

export const StudentUpdateToOneWithWhereWithoutGradesInputObjectSchema: z.ZodType<Prisma.StudentUpdateToOneWithWhereWithoutGradesInput, z.ZodTypeDef, Prisma.StudentUpdateToOneWithWhereWithoutGradesInput> = z.object({
  where: z.lazy(() => StudentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => StudentUpdateWithoutGradesInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutGradesInputObjectSchema)])
}).strict();
export const StudentUpdateToOneWithWhereWithoutGradesInputObjectZodSchema = z.object({
  where: z.lazy(() => StudentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => StudentUpdateWithoutGradesInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutGradesInputObjectSchema)])
}).strict();
