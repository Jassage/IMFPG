import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearUpdateWithoutPaymentsInputObjectSchema } from './AcademicYearUpdateWithoutPaymentsInput.schema';
import { AcademicYearUncheckedUpdateWithoutPaymentsInputObjectSchema } from './AcademicYearUncheckedUpdateWithoutPaymentsInput.schema';
import { AcademicYearCreateWithoutPaymentsInputObjectSchema } from './AcademicYearCreateWithoutPaymentsInput.schema';
import { AcademicYearUncheckedCreateWithoutPaymentsInputObjectSchema } from './AcademicYearUncheckedCreateWithoutPaymentsInput.schema';
import { AcademicYearWhereInputObjectSchema } from './AcademicYearWhereInput.schema'

export const AcademicYearUpsertWithoutPaymentsInputObjectSchema: z.ZodType<Prisma.AcademicYearUpsertWithoutPaymentsInput, z.ZodTypeDef, Prisma.AcademicYearUpsertWithoutPaymentsInput> = z.object({
  update: z.union([z.lazy(() => AcademicYearUpdateWithoutPaymentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedUpdateWithoutPaymentsInputObjectSchema)]),
  create: z.union([z.lazy(() => AcademicYearCreateWithoutPaymentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutPaymentsInputObjectSchema)]),
  where: z.lazy(() => AcademicYearWhereInputObjectSchema).optional()
}).strict();
export const AcademicYearUpsertWithoutPaymentsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => AcademicYearUpdateWithoutPaymentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedUpdateWithoutPaymentsInputObjectSchema)]),
  create: z.union([z.lazy(() => AcademicYearCreateWithoutPaymentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutPaymentsInputObjectSchema)]),
  where: z.lazy(() => AcademicYearWhereInputObjectSchema).optional()
}).strict();
