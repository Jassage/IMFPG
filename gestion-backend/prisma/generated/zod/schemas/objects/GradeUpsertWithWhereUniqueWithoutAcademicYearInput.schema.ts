import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeWhereUniqueInputObjectSchema } from './GradeWhereUniqueInput.schema';
import { GradeUpdateWithoutAcademicYearInputObjectSchema } from './GradeUpdateWithoutAcademicYearInput.schema';
import { GradeUncheckedUpdateWithoutAcademicYearInputObjectSchema } from './GradeUncheckedUpdateWithoutAcademicYearInput.schema';
import { GradeCreateWithoutAcademicYearInputObjectSchema } from './GradeCreateWithoutAcademicYearInput.schema';
import { GradeUncheckedCreateWithoutAcademicYearInputObjectSchema } from './GradeUncheckedCreateWithoutAcademicYearInput.schema'

export const GradeUpsertWithWhereUniqueWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.GradeUpsertWithWhereUniqueWithoutAcademicYearInput, z.ZodTypeDef, Prisma.GradeUpsertWithWhereUniqueWithoutAcademicYearInput> = z.object({
  where: z.lazy(() => GradeWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => GradeUpdateWithoutAcademicYearInputObjectSchema), z.lazy(() => GradeUncheckedUpdateWithoutAcademicYearInputObjectSchema)]),
  create: z.union([z.lazy(() => GradeCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutAcademicYearInputObjectSchema)])
}).strict();
export const GradeUpsertWithWhereUniqueWithoutAcademicYearInputObjectZodSchema = z.object({
  where: z.lazy(() => GradeWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => GradeUpdateWithoutAcademicYearInputObjectSchema), z.lazy(() => GradeUncheckedUpdateWithoutAcademicYearInputObjectSchema)]),
  create: z.union([z.lazy(() => GradeCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutAcademicYearInputObjectSchema)])
}).strict();
