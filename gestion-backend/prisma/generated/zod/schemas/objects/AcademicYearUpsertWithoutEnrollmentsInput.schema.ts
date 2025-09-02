import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearUpdateWithoutEnrollmentsInputObjectSchema } from './AcademicYearUpdateWithoutEnrollmentsInput.schema';
import { AcademicYearUncheckedUpdateWithoutEnrollmentsInputObjectSchema } from './AcademicYearUncheckedUpdateWithoutEnrollmentsInput.schema';
import { AcademicYearCreateWithoutEnrollmentsInputObjectSchema } from './AcademicYearCreateWithoutEnrollmentsInput.schema';
import { AcademicYearUncheckedCreateWithoutEnrollmentsInputObjectSchema } from './AcademicYearUncheckedCreateWithoutEnrollmentsInput.schema';
import { AcademicYearWhereInputObjectSchema } from './AcademicYearWhereInput.schema'

export const AcademicYearUpsertWithoutEnrollmentsInputObjectSchema: z.ZodType<Prisma.AcademicYearUpsertWithoutEnrollmentsInput, z.ZodTypeDef, Prisma.AcademicYearUpsertWithoutEnrollmentsInput> = z.object({
  update: z.union([z.lazy(() => AcademicYearUpdateWithoutEnrollmentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedUpdateWithoutEnrollmentsInputObjectSchema)]),
  create: z.union([z.lazy(() => AcademicYearCreateWithoutEnrollmentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutEnrollmentsInputObjectSchema)]),
  where: z.lazy(() => AcademicYearWhereInputObjectSchema).optional()
}).strict();
export const AcademicYearUpsertWithoutEnrollmentsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => AcademicYearUpdateWithoutEnrollmentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedUpdateWithoutEnrollmentsInputObjectSchema)]),
  create: z.union([z.lazy(() => AcademicYearCreateWithoutEnrollmentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutEnrollmentsInputObjectSchema)]),
  where: z.lazy(() => AcademicYearWhereInputObjectSchema).optional()
}).strict();
