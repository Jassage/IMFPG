import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentWhereUniqueInputObjectSchema } from './EnrollmentWhereUniqueInput.schema';
import { EnrollmentCreateWithoutAcademicYearInputObjectSchema } from './EnrollmentCreateWithoutAcademicYearInput.schema';
import { EnrollmentUncheckedCreateWithoutAcademicYearInputObjectSchema } from './EnrollmentUncheckedCreateWithoutAcademicYearInput.schema'

export const EnrollmentCreateOrConnectWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.EnrollmentCreateOrConnectWithoutAcademicYearInput, z.ZodTypeDef, Prisma.EnrollmentCreateOrConnectWithoutAcademicYearInput> = z.object({
  where: z.lazy(() => EnrollmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => EnrollmentCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => EnrollmentUncheckedCreateWithoutAcademicYearInputObjectSchema)])
}).strict();
export const EnrollmentCreateOrConnectWithoutAcademicYearInputObjectZodSchema = z.object({
  where: z.lazy(() => EnrollmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => EnrollmentCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => EnrollmentUncheckedCreateWithoutAcademicYearInputObjectSchema)])
}).strict();
