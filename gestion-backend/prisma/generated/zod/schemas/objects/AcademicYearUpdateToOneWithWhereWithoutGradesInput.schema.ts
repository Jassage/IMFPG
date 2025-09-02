import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearWhereInputObjectSchema } from './AcademicYearWhereInput.schema';
import { AcademicYearUpdateWithoutGradesInputObjectSchema } from './AcademicYearUpdateWithoutGradesInput.schema';
import { AcademicYearUncheckedUpdateWithoutGradesInputObjectSchema } from './AcademicYearUncheckedUpdateWithoutGradesInput.schema'

export const AcademicYearUpdateToOneWithWhereWithoutGradesInputObjectSchema: z.ZodType<Prisma.AcademicYearUpdateToOneWithWhereWithoutGradesInput, z.ZodTypeDef, Prisma.AcademicYearUpdateToOneWithWhereWithoutGradesInput> = z.object({
  where: z.lazy(() => AcademicYearWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => AcademicYearUpdateWithoutGradesInputObjectSchema), z.lazy(() => AcademicYearUncheckedUpdateWithoutGradesInputObjectSchema)])
}).strict();
export const AcademicYearUpdateToOneWithWhereWithoutGradesInputObjectZodSchema = z.object({
  where: z.lazy(() => AcademicYearWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => AcademicYearUpdateWithoutGradesInputObjectSchema), z.lazy(() => AcademicYearUncheckedUpdateWithoutGradesInputObjectSchema)])
}).strict();
