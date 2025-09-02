import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearWhereInputObjectSchema } from './AcademicYearWhereInput.schema';
import { AcademicYearUpdateWithoutEnrollmentsInputObjectSchema } from './AcademicYearUpdateWithoutEnrollmentsInput.schema';
import { AcademicYearUncheckedUpdateWithoutEnrollmentsInputObjectSchema } from './AcademicYearUncheckedUpdateWithoutEnrollmentsInput.schema'

export const AcademicYearUpdateToOneWithWhereWithoutEnrollmentsInputObjectSchema: z.ZodType<Prisma.AcademicYearUpdateToOneWithWhereWithoutEnrollmentsInput, z.ZodTypeDef, Prisma.AcademicYearUpdateToOneWithWhereWithoutEnrollmentsInput> = z.object({
  where: z.lazy(() => AcademicYearWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => AcademicYearUpdateWithoutEnrollmentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedUpdateWithoutEnrollmentsInputObjectSchema)])
}).strict();
export const AcademicYearUpdateToOneWithWhereWithoutEnrollmentsInputObjectZodSchema = z.object({
  where: z.lazy(() => AcademicYearWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => AcademicYearUpdateWithoutEnrollmentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedUpdateWithoutEnrollmentsInputObjectSchema)])
}).strict();
