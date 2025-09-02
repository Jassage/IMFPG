import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeScalarWhereInputObjectSchema } from './GradeScalarWhereInput.schema';
import { GradeUpdateManyMutationInputObjectSchema } from './GradeUpdateManyMutationInput.schema';
import { GradeUncheckedUpdateManyWithoutAcademicYearInputObjectSchema } from './GradeUncheckedUpdateManyWithoutAcademicYearInput.schema'

export const GradeUpdateManyWithWhereWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.GradeUpdateManyWithWhereWithoutAcademicYearInput, z.ZodTypeDef, Prisma.GradeUpdateManyWithWhereWithoutAcademicYearInput> = z.object({
  where: z.lazy(() => GradeScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => GradeUpdateManyMutationInputObjectSchema), z.lazy(() => GradeUncheckedUpdateManyWithoutAcademicYearInputObjectSchema)])
}).strict();
export const GradeUpdateManyWithWhereWithoutAcademicYearInputObjectZodSchema = z.object({
  where: z.lazy(() => GradeScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => GradeUpdateManyMutationInputObjectSchema), z.lazy(() => GradeUncheckedUpdateManyWithoutAcademicYearInputObjectSchema)])
}).strict();
