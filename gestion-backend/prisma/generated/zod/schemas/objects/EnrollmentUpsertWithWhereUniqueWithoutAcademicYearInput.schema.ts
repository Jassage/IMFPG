import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentWhereUniqueInputObjectSchema } from './EnrollmentWhereUniqueInput.schema';
import { EnrollmentUpdateWithoutAcademicYearInputObjectSchema } from './EnrollmentUpdateWithoutAcademicYearInput.schema';
import { EnrollmentUncheckedUpdateWithoutAcademicYearInputObjectSchema } from './EnrollmentUncheckedUpdateWithoutAcademicYearInput.schema';
import { EnrollmentCreateWithoutAcademicYearInputObjectSchema } from './EnrollmentCreateWithoutAcademicYearInput.schema';
import { EnrollmentUncheckedCreateWithoutAcademicYearInputObjectSchema } from './EnrollmentUncheckedCreateWithoutAcademicYearInput.schema'

export const EnrollmentUpsertWithWhereUniqueWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.EnrollmentUpsertWithWhereUniqueWithoutAcademicYearInput, z.ZodTypeDef, Prisma.EnrollmentUpsertWithWhereUniqueWithoutAcademicYearInput> = z.object({
  where: z.lazy(() => EnrollmentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => EnrollmentUpdateWithoutAcademicYearInputObjectSchema), z.lazy(() => EnrollmentUncheckedUpdateWithoutAcademicYearInputObjectSchema)]),
  create: z.union([z.lazy(() => EnrollmentCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => EnrollmentUncheckedCreateWithoutAcademicYearInputObjectSchema)])
}).strict();
export const EnrollmentUpsertWithWhereUniqueWithoutAcademicYearInputObjectZodSchema = z.object({
  where: z.lazy(() => EnrollmentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => EnrollmentUpdateWithoutAcademicYearInputObjectSchema), z.lazy(() => EnrollmentUncheckedUpdateWithoutAcademicYearInputObjectSchema)]),
  create: z.union([z.lazy(() => EnrollmentCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => EnrollmentUncheckedCreateWithoutAcademicYearInputObjectSchema)])
}).strict();
