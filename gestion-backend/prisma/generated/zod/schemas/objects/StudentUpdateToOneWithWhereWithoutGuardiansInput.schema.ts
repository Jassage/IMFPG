import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema';
import { StudentUpdateWithoutGuardiansInputObjectSchema } from './StudentUpdateWithoutGuardiansInput.schema';
import { StudentUncheckedUpdateWithoutGuardiansInputObjectSchema } from './StudentUncheckedUpdateWithoutGuardiansInput.schema'

export const StudentUpdateToOneWithWhereWithoutGuardiansInputObjectSchema: z.ZodType<Prisma.StudentUpdateToOneWithWhereWithoutGuardiansInput, z.ZodTypeDef, Prisma.StudentUpdateToOneWithWhereWithoutGuardiansInput> = z.object({
  where: z.lazy(() => StudentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => StudentUpdateWithoutGuardiansInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutGuardiansInputObjectSchema)])
}).strict();
export const StudentUpdateToOneWithWhereWithoutGuardiansInputObjectZodSchema = z.object({
  where: z.lazy(() => StudentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => StudentUpdateWithoutGuardiansInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutGuardiansInputObjectSchema)])
}).strict();
