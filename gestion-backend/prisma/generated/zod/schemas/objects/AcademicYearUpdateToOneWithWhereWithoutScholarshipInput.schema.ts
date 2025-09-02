import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearWhereInputObjectSchema } from './AcademicYearWhereInput.schema';
import { AcademicYearUpdateWithoutScholarshipInputObjectSchema } from './AcademicYearUpdateWithoutScholarshipInput.schema';
import { AcademicYearUncheckedUpdateWithoutScholarshipInputObjectSchema } from './AcademicYearUncheckedUpdateWithoutScholarshipInput.schema'

export const AcademicYearUpdateToOneWithWhereWithoutScholarshipInputObjectSchema: z.ZodType<Prisma.AcademicYearUpdateToOneWithWhereWithoutScholarshipInput, z.ZodTypeDef, Prisma.AcademicYearUpdateToOneWithWhereWithoutScholarshipInput> = z.object({
  where: z.lazy(() => AcademicYearWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => AcademicYearUpdateWithoutScholarshipInputObjectSchema), z.lazy(() => AcademicYearUncheckedUpdateWithoutScholarshipInputObjectSchema)])
}).strict();
export const AcademicYearUpdateToOneWithWhereWithoutScholarshipInputObjectZodSchema = z.object({
  where: z.lazy(() => AcademicYearWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => AcademicYearUpdateWithoutScholarshipInputObjectSchema), z.lazy(() => AcademicYearUncheckedUpdateWithoutScholarshipInputObjectSchema)])
}).strict();
