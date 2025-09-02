import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentCreateWithoutAcademicYearInputObjectSchema } from './EnrollmentCreateWithoutAcademicYearInput.schema';
import { EnrollmentUncheckedCreateWithoutAcademicYearInputObjectSchema } from './EnrollmentUncheckedCreateWithoutAcademicYearInput.schema';
import { EnrollmentCreateOrConnectWithoutAcademicYearInputObjectSchema } from './EnrollmentCreateOrConnectWithoutAcademicYearInput.schema';
import { EnrollmentCreateManyAcademicYearInputEnvelopeObjectSchema } from './EnrollmentCreateManyAcademicYearInputEnvelope.schema';
import { EnrollmentWhereUniqueInputObjectSchema } from './EnrollmentWhereUniqueInput.schema'

export const EnrollmentUncheckedCreateNestedManyWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.EnrollmentUncheckedCreateNestedManyWithoutAcademicYearInput, z.ZodTypeDef, Prisma.EnrollmentUncheckedCreateNestedManyWithoutAcademicYearInput> = z.object({
  create: z.union([z.lazy(() => EnrollmentCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => EnrollmentCreateWithoutAcademicYearInputObjectSchema).array(), z.lazy(() => EnrollmentUncheckedCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => EnrollmentUncheckedCreateWithoutAcademicYearInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => EnrollmentCreateOrConnectWithoutAcademicYearInputObjectSchema), z.lazy(() => EnrollmentCreateOrConnectWithoutAcademicYearInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => EnrollmentCreateManyAcademicYearInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => EnrollmentWhereUniqueInputObjectSchema), z.lazy(() => EnrollmentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const EnrollmentUncheckedCreateNestedManyWithoutAcademicYearInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => EnrollmentCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => EnrollmentCreateWithoutAcademicYearInputObjectSchema).array(), z.lazy(() => EnrollmentUncheckedCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => EnrollmentUncheckedCreateWithoutAcademicYearInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => EnrollmentCreateOrConnectWithoutAcademicYearInputObjectSchema), z.lazy(() => EnrollmentCreateOrConnectWithoutAcademicYearInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => EnrollmentCreateManyAcademicYearInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => EnrollmentWhereUniqueInputObjectSchema), z.lazy(() => EnrollmentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
