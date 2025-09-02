import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentCreateWithoutFacultyInputObjectSchema } from './EnrollmentCreateWithoutFacultyInput.schema';
import { EnrollmentUncheckedCreateWithoutFacultyInputObjectSchema } from './EnrollmentUncheckedCreateWithoutFacultyInput.schema';
import { EnrollmentCreateOrConnectWithoutFacultyInputObjectSchema } from './EnrollmentCreateOrConnectWithoutFacultyInput.schema';
import { EnrollmentUpsertWithWhereUniqueWithoutFacultyInputObjectSchema } from './EnrollmentUpsertWithWhereUniqueWithoutFacultyInput.schema';
import { EnrollmentCreateManyFacultyInputEnvelopeObjectSchema } from './EnrollmentCreateManyFacultyInputEnvelope.schema';
import { EnrollmentWhereUniqueInputObjectSchema } from './EnrollmentWhereUniqueInput.schema';
import { EnrollmentUpdateWithWhereUniqueWithoutFacultyInputObjectSchema } from './EnrollmentUpdateWithWhereUniqueWithoutFacultyInput.schema';
import { EnrollmentUpdateManyWithWhereWithoutFacultyInputObjectSchema } from './EnrollmentUpdateManyWithWhereWithoutFacultyInput.schema';
import { EnrollmentScalarWhereInputObjectSchema } from './EnrollmentScalarWhereInput.schema'

export const EnrollmentUpdateManyWithoutFacultyNestedInputObjectSchema: z.ZodType<Prisma.EnrollmentUpdateManyWithoutFacultyNestedInput, z.ZodTypeDef, Prisma.EnrollmentUpdateManyWithoutFacultyNestedInput> = z.object({
  create: z.union([z.lazy(() => EnrollmentCreateWithoutFacultyInputObjectSchema), z.lazy(() => EnrollmentCreateWithoutFacultyInputObjectSchema).array(), z.lazy(() => EnrollmentUncheckedCreateWithoutFacultyInputObjectSchema), z.lazy(() => EnrollmentUncheckedCreateWithoutFacultyInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => EnrollmentCreateOrConnectWithoutFacultyInputObjectSchema), z.lazy(() => EnrollmentCreateOrConnectWithoutFacultyInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => EnrollmentUpsertWithWhereUniqueWithoutFacultyInputObjectSchema), z.lazy(() => EnrollmentUpsertWithWhereUniqueWithoutFacultyInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => EnrollmentCreateManyFacultyInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => EnrollmentWhereUniqueInputObjectSchema), z.lazy(() => EnrollmentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => EnrollmentWhereUniqueInputObjectSchema), z.lazy(() => EnrollmentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => EnrollmentWhereUniqueInputObjectSchema), z.lazy(() => EnrollmentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => EnrollmentWhereUniqueInputObjectSchema), z.lazy(() => EnrollmentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => EnrollmentUpdateWithWhereUniqueWithoutFacultyInputObjectSchema), z.lazy(() => EnrollmentUpdateWithWhereUniqueWithoutFacultyInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => EnrollmentUpdateManyWithWhereWithoutFacultyInputObjectSchema), z.lazy(() => EnrollmentUpdateManyWithWhereWithoutFacultyInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => EnrollmentScalarWhereInputObjectSchema), z.lazy(() => EnrollmentScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const EnrollmentUpdateManyWithoutFacultyNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => EnrollmentCreateWithoutFacultyInputObjectSchema), z.lazy(() => EnrollmentCreateWithoutFacultyInputObjectSchema).array(), z.lazy(() => EnrollmentUncheckedCreateWithoutFacultyInputObjectSchema), z.lazy(() => EnrollmentUncheckedCreateWithoutFacultyInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => EnrollmentCreateOrConnectWithoutFacultyInputObjectSchema), z.lazy(() => EnrollmentCreateOrConnectWithoutFacultyInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => EnrollmentUpsertWithWhereUniqueWithoutFacultyInputObjectSchema), z.lazy(() => EnrollmentUpsertWithWhereUniqueWithoutFacultyInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => EnrollmentCreateManyFacultyInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => EnrollmentWhereUniqueInputObjectSchema), z.lazy(() => EnrollmentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => EnrollmentWhereUniqueInputObjectSchema), z.lazy(() => EnrollmentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => EnrollmentWhereUniqueInputObjectSchema), z.lazy(() => EnrollmentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => EnrollmentWhereUniqueInputObjectSchema), z.lazy(() => EnrollmentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => EnrollmentUpdateWithWhereUniqueWithoutFacultyInputObjectSchema), z.lazy(() => EnrollmentUpdateWithWhereUniqueWithoutFacultyInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => EnrollmentUpdateManyWithWhereWithoutFacultyInputObjectSchema), z.lazy(() => EnrollmentUpdateManyWithWhereWithoutFacultyInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => EnrollmentScalarWhereInputObjectSchema), z.lazy(() => EnrollmentScalarWhereInputObjectSchema).array()]).optional()
}).strict();
