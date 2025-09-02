import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeWhereUniqueInputObjectSchema } from './GradeWhereUniqueInput.schema';
import { GradeUpdateWithoutAcademicYearInputObjectSchema } from './GradeUpdateWithoutAcademicYearInput.schema';
import { GradeUncheckedUpdateWithoutAcademicYearInputObjectSchema } from './GradeUncheckedUpdateWithoutAcademicYearInput.schema'

export const GradeUpdateWithWhereUniqueWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.GradeUpdateWithWhereUniqueWithoutAcademicYearInput, z.ZodTypeDef, Prisma.GradeUpdateWithWhereUniqueWithoutAcademicYearInput> = z.object({
  where: z.lazy(() => GradeWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => GradeUpdateWithoutAcademicYearInputObjectSchema), z.lazy(() => GradeUncheckedUpdateWithoutAcademicYearInputObjectSchema)])
}).strict();
export const GradeUpdateWithWhereUniqueWithoutAcademicYearInputObjectZodSchema = z.object({
  where: z.lazy(() => GradeWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => GradeUpdateWithoutAcademicYearInputObjectSchema), z.lazy(() => GradeUncheckedUpdateWithoutAcademicYearInputObjectSchema)])
}).strict();
