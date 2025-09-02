import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentCreateWithoutFacultyInputObjectSchema } from './EnrollmentCreateWithoutFacultyInput.schema';
import { EnrollmentUncheckedCreateWithoutFacultyInputObjectSchema } from './EnrollmentUncheckedCreateWithoutFacultyInput.schema';
import { EnrollmentCreateOrConnectWithoutFacultyInputObjectSchema } from './EnrollmentCreateOrConnectWithoutFacultyInput.schema';
import { EnrollmentCreateManyFacultyInputEnvelopeObjectSchema } from './EnrollmentCreateManyFacultyInputEnvelope.schema';
import { EnrollmentWhereUniqueInputObjectSchema } from './EnrollmentWhereUniqueInput.schema'

export const EnrollmentCreateNestedManyWithoutFacultyInputObjectSchema: z.ZodType<Prisma.EnrollmentCreateNestedManyWithoutFacultyInput, z.ZodTypeDef, Prisma.EnrollmentCreateNestedManyWithoutFacultyInput> = z.object({
  create: z.union([z.lazy(() => EnrollmentCreateWithoutFacultyInputObjectSchema), z.lazy(() => EnrollmentCreateWithoutFacultyInputObjectSchema).array(), z.lazy(() => EnrollmentUncheckedCreateWithoutFacultyInputObjectSchema), z.lazy(() => EnrollmentUncheckedCreateWithoutFacultyInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => EnrollmentCreateOrConnectWithoutFacultyInputObjectSchema), z.lazy(() => EnrollmentCreateOrConnectWithoutFacultyInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => EnrollmentCreateManyFacultyInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => EnrollmentWhereUniqueInputObjectSchema), z.lazy(() => EnrollmentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const EnrollmentCreateNestedManyWithoutFacultyInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => EnrollmentCreateWithoutFacultyInputObjectSchema), z.lazy(() => EnrollmentCreateWithoutFacultyInputObjectSchema).array(), z.lazy(() => EnrollmentUncheckedCreateWithoutFacultyInputObjectSchema), z.lazy(() => EnrollmentUncheckedCreateWithoutFacultyInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => EnrollmentCreateOrConnectWithoutFacultyInputObjectSchema), z.lazy(() => EnrollmentCreateOrConnectWithoutFacultyInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => EnrollmentCreateManyFacultyInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => EnrollmentWhereUniqueInputObjectSchema), z.lazy(() => EnrollmentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
