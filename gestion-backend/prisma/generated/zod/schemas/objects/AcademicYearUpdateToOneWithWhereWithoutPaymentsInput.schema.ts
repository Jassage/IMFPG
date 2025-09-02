import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearWhereInputObjectSchema } from './AcademicYearWhereInput.schema';
import { AcademicYearUpdateWithoutPaymentsInputObjectSchema } from './AcademicYearUpdateWithoutPaymentsInput.schema';
import { AcademicYearUncheckedUpdateWithoutPaymentsInputObjectSchema } from './AcademicYearUncheckedUpdateWithoutPaymentsInput.schema'

export const AcademicYearUpdateToOneWithWhereWithoutPaymentsInputObjectSchema: z.ZodType<Prisma.AcademicYearUpdateToOneWithWhereWithoutPaymentsInput, z.ZodTypeDef, Prisma.AcademicYearUpdateToOneWithWhereWithoutPaymentsInput> = z.object({
  where: z.lazy(() => AcademicYearWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => AcademicYearUpdateWithoutPaymentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedUpdateWithoutPaymentsInputObjectSchema)])
}).strict();
export const AcademicYearUpdateToOneWithWhereWithoutPaymentsInputObjectZodSchema = z.object({
  where: z.lazy(() => AcademicYearWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => AcademicYearUpdateWithoutPaymentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedUpdateWithoutPaymentsInputObjectSchema)])
}).strict();
