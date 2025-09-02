import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipWhereUniqueInputObjectSchema } from './ScholarshipWhereUniqueInput.schema';
import { ScholarshipUpdateWithoutAcademicYearInputObjectSchema } from './ScholarshipUpdateWithoutAcademicYearInput.schema';
import { ScholarshipUncheckedUpdateWithoutAcademicYearInputObjectSchema } from './ScholarshipUncheckedUpdateWithoutAcademicYearInput.schema'

export const ScholarshipUpdateWithWhereUniqueWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.ScholarshipUpdateWithWhereUniqueWithoutAcademicYearInput, z.ZodTypeDef, Prisma.ScholarshipUpdateWithWhereUniqueWithoutAcademicYearInput> = z.object({
  where: z.lazy(() => ScholarshipWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ScholarshipUpdateWithoutAcademicYearInputObjectSchema), z.lazy(() => ScholarshipUncheckedUpdateWithoutAcademicYearInputObjectSchema)])
}).strict();
export const ScholarshipUpdateWithWhereUniqueWithoutAcademicYearInputObjectZodSchema = z.object({
  where: z.lazy(() => ScholarshipWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ScholarshipUpdateWithoutAcademicYearInputObjectSchema), z.lazy(() => ScholarshipUncheckedUpdateWithoutAcademicYearInputObjectSchema)])
}).strict();
