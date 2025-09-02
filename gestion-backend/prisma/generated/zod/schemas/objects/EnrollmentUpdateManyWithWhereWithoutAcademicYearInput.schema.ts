import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentScalarWhereInputObjectSchema } from './EnrollmentScalarWhereInput.schema';
import { EnrollmentUpdateManyMutationInputObjectSchema } from './EnrollmentUpdateManyMutationInput.schema';
import { EnrollmentUncheckedUpdateManyWithoutAcademicYearInputObjectSchema } from './EnrollmentUncheckedUpdateManyWithoutAcademicYearInput.schema'

export const EnrollmentUpdateManyWithWhereWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.EnrollmentUpdateManyWithWhereWithoutAcademicYearInput, z.ZodTypeDef, Prisma.EnrollmentUpdateManyWithWhereWithoutAcademicYearInput> = z.object({
  where: z.lazy(() => EnrollmentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => EnrollmentUpdateManyMutationInputObjectSchema), z.lazy(() => EnrollmentUncheckedUpdateManyWithoutAcademicYearInputObjectSchema)])
}).strict();
export const EnrollmentUpdateManyWithWhereWithoutAcademicYearInputObjectZodSchema = z.object({
  where: z.lazy(() => EnrollmentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => EnrollmentUpdateManyMutationInputObjectSchema), z.lazy(() => EnrollmentUncheckedUpdateManyWithoutAcademicYearInputObjectSchema)])
}).strict();
