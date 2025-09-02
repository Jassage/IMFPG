import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearUpdateWithoutGradesInputObjectSchema } from './AcademicYearUpdateWithoutGradesInput.schema';
import { AcademicYearUncheckedUpdateWithoutGradesInputObjectSchema } from './AcademicYearUncheckedUpdateWithoutGradesInput.schema';
import { AcademicYearCreateWithoutGradesInputObjectSchema } from './AcademicYearCreateWithoutGradesInput.schema';
import { AcademicYearUncheckedCreateWithoutGradesInputObjectSchema } from './AcademicYearUncheckedCreateWithoutGradesInput.schema';
import { AcademicYearWhereInputObjectSchema } from './AcademicYearWhereInput.schema'

export const AcademicYearUpsertWithoutGradesInputObjectSchema: z.ZodType<Prisma.AcademicYearUpsertWithoutGradesInput, z.ZodTypeDef, Prisma.AcademicYearUpsertWithoutGradesInput> = z.object({
  update: z.union([z.lazy(() => AcademicYearUpdateWithoutGradesInputObjectSchema), z.lazy(() => AcademicYearUncheckedUpdateWithoutGradesInputObjectSchema)]),
  create: z.union([z.lazy(() => AcademicYearCreateWithoutGradesInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutGradesInputObjectSchema)]),
  where: z.lazy(() => AcademicYearWhereInputObjectSchema).optional()
}).strict();
export const AcademicYearUpsertWithoutGradesInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => AcademicYearUpdateWithoutGradesInputObjectSchema), z.lazy(() => AcademicYearUncheckedUpdateWithoutGradesInputObjectSchema)]),
  create: z.union([z.lazy(() => AcademicYearCreateWithoutGradesInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutGradesInputObjectSchema)]),
  where: z.lazy(() => AcademicYearWhereInputObjectSchema).optional()
}).strict();
