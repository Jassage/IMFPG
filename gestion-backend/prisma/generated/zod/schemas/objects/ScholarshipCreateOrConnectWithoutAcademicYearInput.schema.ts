import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipWhereUniqueInputObjectSchema } from './ScholarshipWhereUniqueInput.schema';
import { ScholarshipCreateWithoutAcademicYearInputObjectSchema } from './ScholarshipCreateWithoutAcademicYearInput.schema';
import { ScholarshipUncheckedCreateWithoutAcademicYearInputObjectSchema } from './ScholarshipUncheckedCreateWithoutAcademicYearInput.schema'

export const ScholarshipCreateOrConnectWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.ScholarshipCreateOrConnectWithoutAcademicYearInput, z.ZodTypeDef, Prisma.ScholarshipCreateOrConnectWithoutAcademicYearInput> = z.object({
  where: z.lazy(() => ScholarshipWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ScholarshipCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => ScholarshipUncheckedCreateWithoutAcademicYearInputObjectSchema)])
}).strict();
export const ScholarshipCreateOrConnectWithoutAcademicYearInputObjectZodSchema = z.object({
  where: z.lazy(() => ScholarshipWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ScholarshipCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => ScholarshipUncheckedCreateWithoutAcademicYearInputObjectSchema)])
}).strict();
