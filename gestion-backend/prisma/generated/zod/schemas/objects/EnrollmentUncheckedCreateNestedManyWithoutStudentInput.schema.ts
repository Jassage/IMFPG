import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentCreateWithoutStudentInputObjectSchema } from './EnrollmentCreateWithoutStudentInput.schema';
import { EnrollmentUncheckedCreateWithoutStudentInputObjectSchema } from './EnrollmentUncheckedCreateWithoutStudentInput.schema';
import { EnrollmentCreateOrConnectWithoutStudentInputObjectSchema } from './EnrollmentCreateOrConnectWithoutStudentInput.schema';
import { EnrollmentCreateManyStudentInputEnvelopeObjectSchema } from './EnrollmentCreateManyStudentInputEnvelope.schema';
import { EnrollmentWhereUniqueInputObjectSchema } from './EnrollmentWhereUniqueInput.schema'

export const EnrollmentUncheckedCreateNestedManyWithoutStudentInputObjectSchema: z.ZodType<Prisma.EnrollmentUncheckedCreateNestedManyWithoutStudentInput, z.ZodTypeDef, Prisma.EnrollmentUncheckedCreateNestedManyWithoutStudentInput> = z.object({
  create: z.union([z.lazy(() => EnrollmentCreateWithoutStudentInputObjectSchema), z.lazy(() => EnrollmentCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => EnrollmentUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => EnrollmentUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => EnrollmentCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => EnrollmentCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => EnrollmentCreateManyStudentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => EnrollmentWhereUniqueInputObjectSchema), z.lazy(() => EnrollmentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const EnrollmentUncheckedCreateNestedManyWithoutStudentInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => EnrollmentCreateWithoutStudentInputObjectSchema), z.lazy(() => EnrollmentCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => EnrollmentUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => EnrollmentUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => EnrollmentCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => EnrollmentCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => EnrollmentCreateManyStudentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => EnrollmentWhereUniqueInputObjectSchema), z.lazy(() => EnrollmentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
