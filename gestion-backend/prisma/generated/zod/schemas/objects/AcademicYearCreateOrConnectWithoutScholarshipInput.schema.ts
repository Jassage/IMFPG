import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearWhereUniqueInputObjectSchema } from './AcademicYearWhereUniqueInput.schema';
import { AcademicYearCreateWithoutScholarshipInputObjectSchema } from './AcademicYearCreateWithoutScholarshipInput.schema';
import { AcademicYearUncheckedCreateWithoutScholarshipInputObjectSchema } from './AcademicYearUncheckedCreateWithoutScholarshipInput.schema'

export const AcademicYearCreateOrConnectWithoutScholarshipInputObjectSchema: z.ZodType<Prisma.AcademicYearCreateOrConnectWithoutScholarshipInput, z.ZodTypeDef, Prisma.AcademicYearCreateOrConnectWithoutScholarshipInput> = z.object({
  where: z.lazy(() => AcademicYearWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AcademicYearCreateWithoutScholarshipInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutScholarshipInputObjectSchema)])
}).strict();
export const AcademicYearCreateOrConnectWithoutScholarshipInputObjectZodSchema = z.object({
  where: z.lazy(() => AcademicYearWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AcademicYearCreateWithoutScholarshipInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutScholarshipInputObjectSchema)])
}).strict();
