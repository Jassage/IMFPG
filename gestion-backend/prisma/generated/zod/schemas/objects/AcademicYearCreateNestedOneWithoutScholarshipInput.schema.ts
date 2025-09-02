import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearCreateWithoutScholarshipInputObjectSchema } from './AcademicYearCreateWithoutScholarshipInput.schema';
import { AcademicYearUncheckedCreateWithoutScholarshipInputObjectSchema } from './AcademicYearUncheckedCreateWithoutScholarshipInput.schema';
import { AcademicYearCreateOrConnectWithoutScholarshipInputObjectSchema } from './AcademicYearCreateOrConnectWithoutScholarshipInput.schema';
import { AcademicYearWhereUniqueInputObjectSchema } from './AcademicYearWhereUniqueInput.schema'

export const AcademicYearCreateNestedOneWithoutScholarshipInputObjectSchema: z.ZodType<Prisma.AcademicYearCreateNestedOneWithoutScholarshipInput, z.ZodTypeDef, Prisma.AcademicYearCreateNestedOneWithoutScholarshipInput> = z.object({
  create: z.union([z.lazy(() => AcademicYearCreateWithoutScholarshipInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutScholarshipInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcademicYearCreateOrConnectWithoutScholarshipInputObjectSchema).optional(),
  connect: z.lazy(() => AcademicYearWhereUniqueInputObjectSchema).optional()
}).strict();
export const AcademicYearCreateNestedOneWithoutScholarshipInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => AcademicYearCreateWithoutScholarshipInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutScholarshipInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcademicYearCreateOrConnectWithoutScholarshipInputObjectSchema).optional(),
  connect: z.lazy(() => AcademicYearWhereUniqueInputObjectSchema).optional()
}).strict();
