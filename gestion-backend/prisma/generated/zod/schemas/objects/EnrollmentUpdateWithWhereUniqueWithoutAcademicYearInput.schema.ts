import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentWhereUniqueInputObjectSchema } from './EnrollmentWhereUniqueInput.schema';
import { EnrollmentUpdateWithoutAcademicYearInputObjectSchema } from './EnrollmentUpdateWithoutAcademicYearInput.schema';
import { EnrollmentUncheckedUpdateWithoutAcademicYearInputObjectSchema } from './EnrollmentUncheckedUpdateWithoutAcademicYearInput.schema'

export const EnrollmentUpdateWithWhereUniqueWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.EnrollmentUpdateWithWhereUniqueWithoutAcademicYearInput, z.ZodTypeDef, Prisma.EnrollmentUpdateWithWhereUniqueWithoutAcademicYearInput> = z.object({
  where: z.lazy(() => EnrollmentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => EnrollmentUpdateWithoutAcademicYearInputObjectSchema), z.lazy(() => EnrollmentUncheckedUpdateWithoutAcademicYearInputObjectSchema)])
}).strict();
export const EnrollmentUpdateWithWhereUniqueWithoutAcademicYearInputObjectZodSchema = z.object({
  where: z.lazy(() => EnrollmentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => EnrollmentUpdateWithoutAcademicYearInputObjectSchema), z.lazy(() => EnrollmentUncheckedUpdateWithoutAcademicYearInputObjectSchema)])
}).strict();
