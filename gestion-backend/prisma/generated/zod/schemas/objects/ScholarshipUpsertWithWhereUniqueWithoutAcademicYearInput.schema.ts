import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipWhereUniqueInputObjectSchema } from './ScholarshipWhereUniqueInput.schema';
import { ScholarshipUpdateWithoutAcademicYearInputObjectSchema } from './ScholarshipUpdateWithoutAcademicYearInput.schema';
import { ScholarshipUncheckedUpdateWithoutAcademicYearInputObjectSchema } from './ScholarshipUncheckedUpdateWithoutAcademicYearInput.schema';
import { ScholarshipCreateWithoutAcademicYearInputObjectSchema } from './ScholarshipCreateWithoutAcademicYearInput.schema';
import { ScholarshipUncheckedCreateWithoutAcademicYearInputObjectSchema } from './ScholarshipUncheckedCreateWithoutAcademicYearInput.schema'

export const ScholarshipUpsertWithWhereUniqueWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.ScholarshipUpsertWithWhereUniqueWithoutAcademicYearInput, z.ZodTypeDef, Prisma.ScholarshipUpsertWithWhereUniqueWithoutAcademicYearInput> = z.object({
  where: z.lazy(() => ScholarshipWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ScholarshipUpdateWithoutAcademicYearInputObjectSchema), z.lazy(() => ScholarshipUncheckedUpdateWithoutAcademicYearInputObjectSchema)]),
  create: z.union([z.lazy(() => ScholarshipCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => ScholarshipUncheckedCreateWithoutAcademicYearInputObjectSchema)])
}).strict();
export const ScholarshipUpsertWithWhereUniqueWithoutAcademicYearInputObjectZodSchema = z.object({
  where: z.lazy(() => ScholarshipWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ScholarshipUpdateWithoutAcademicYearInputObjectSchema), z.lazy(() => ScholarshipUncheckedUpdateWithoutAcademicYearInputObjectSchema)]),
  create: z.union([z.lazy(() => ScholarshipCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => ScholarshipUncheckedCreateWithoutAcademicYearInputObjectSchema)])
}).strict();
