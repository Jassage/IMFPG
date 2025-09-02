import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipScalarWhereInputObjectSchema } from './ScholarshipScalarWhereInput.schema';
import { ScholarshipUpdateManyMutationInputObjectSchema } from './ScholarshipUpdateManyMutationInput.schema';
import { ScholarshipUncheckedUpdateManyWithoutAcademicYearInputObjectSchema } from './ScholarshipUncheckedUpdateManyWithoutAcademicYearInput.schema'

export const ScholarshipUpdateManyWithWhereWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.ScholarshipUpdateManyWithWhereWithoutAcademicYearInput, z.ZodTypeDef, Prisma.ScholarshipUpdateManyWithWhereWithoutAcademicYearInput> = z.object({
  where: z.lazy(() => ScholarshipScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ScholarshipUpdateManyMutationInputObjectSchema), z.lazy(() => ScholarshipUncheckedUpdateManyWithoutAcademicYearInputObjectSchema)])
}).strict();
export const ScholarshipUpdateManyWithWhereWithoutAcademicYearInputObjectZodSchema = z.object({
  where: z.lazy(() => ScholarshipScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ScholarshipUpdateManyMutationInputObjectSchema), z.lazy(() => ScholarshipUncheckedUpdateManyWithoutAcademicYearInputObjectSchema)])
}).strict();
