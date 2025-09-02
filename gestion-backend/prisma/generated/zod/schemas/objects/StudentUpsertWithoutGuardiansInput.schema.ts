import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentUpdateWithoutGuardiansInputObjectSchema } from './StudentUpdateWithoutGuardiansInput.schema';
import { StudentUncheckedUpdateWithoutGuardiansInputObjectSchema } from './StudentUncheckedUpdateWithoutGuardiansInput.schema';
import { StudentCreateWithoutGuardiansInputObjectSchema } from './StudentCreateWithoutGuardiansInput.schema';
import { StudentUncheckedCreateWithoutGuardiansInputObjectSchema } from './StudentUncheckedCreateWithoutGuardiansInput.schema';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema'

export const StudentUpsertWithoutGuardiansInputObjectSchema: z.ZodType<Prisma.StudentUpsertWithoutGuardiansInput, z.ZodTypeDef, Prisma.StudentUpsertWithoutGuardiansInput> = z.object({
  update: z.union([z.lazy(() => StudentUpdateWithoutGuardiansInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutGuardiansInputObjectSchema)]),
  create: z.union([z.lazy(() => StudentCreateWithoutGuardiansInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutGuardiansInputObjectSchema)]),
  where: z.lazy(() => StudentWhereInputObjectSchema).optional()
}).strict();
export const StudentUpsertWithoutGuardiansInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => StudentUpdateWithoutGuardiansInputObjectSchema), z.lazy(() => StudentUncheckedUpdateWithoutGuardiansInputObjectSchema)]),
  create: z.union([z.lazy(() => StudentCreateWithoutGuardiansInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutGuardiansInputObjectSchema)]),
  where: z.lazy(() => StudentWhereInputObjectSchema).optional()
}).strict();
