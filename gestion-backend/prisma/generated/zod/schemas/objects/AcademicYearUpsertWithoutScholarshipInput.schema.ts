import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearUpdateWithoutScholarshipInputObjectSchema } from './AcademicYearUpdateWithoutScholarshipInput.schema';
import { AcademicYearUncheckedUpdateWithoutScholarshipInputObjectSchema } from './AcademicYearUncheckedUpdateWithoutScholarshipInput.schema';
import { AcademicYearCreateWithoutScholarshipInputObjectSchema } from './AcademicYearCreateWithoutScholarshipInput.schema';
import { AcademicYearUncheckedCreateWithoutScholarshipInputObjectSchema } from './AcademicYearUncheckedCreateWithoutScholarshipInput.schema';
import { AcademicYearWhereInputObjectSchema } from './AcademicYearWhereInput.schema'

export const AcademicYearUpsertWithoutScholarshipInputObjectSchema: z.ZodType<Prisma.AcademicYearUpsertWithoutScholarshipInput, z.ZodTypeDef, Prisma.AcademicYearUpsertWithoutScholarshipInput> = z.object({
  update: z.union([z.lazy(() => AcademicYearUpdateWithoutScholarshipInputObjectSchema), z.lazy(() => AcademicYearUncheckedUpdateWithoutScholarshipInputObjectSchema)]),
  create: z.union([z.lazy(() => AcademicYearCreateWithoutScholarshipInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutScholarshipInputObjectSchema)]),
  where: z.lazy(() => AcademicYearWhereInputObjectSchema).optional()
}).strict();
export const AcademicYearUpsertWithoutScholarshipInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => AcademicYearUpdateWithoutScholarshipInputObjectSchema), z.lazy(() => AcademicYearUncheckedUpdateWithoutScholarshipInputObjectSchema)]),
  create: z.union([z.lazy(() => AcademicYearCreateWithoutScholarshipInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutScholarshipInputObjectSchema)]),
  where: z.lazy(() => AcademicYearWhereInputObjectSchema).optional()
}).strict();
