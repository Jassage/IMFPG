import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentCreateWithoutStudentInputObjectSchema } from './EnrollmentCreateWithoutStudentInput.schema';
import { EnrollmentUncheckedCreateWithoutStudentInputObjectSchema } from './EnrollmentUncheckedCreateWithoutStudentInput.schema';
import { EnrollmentCreateOrConnectWithoutStudentInputObjectSchema } from './EnrollmentCreateOrConnectWithoutStudentInput.schema';
import { EnrollmentUpsertWithWhereUniqueWithoutStudentInputObjectSchema } from './EnrollmentUpsertWithWhereUniqueWithoutStudentInput.schema';
import { EnrollmentCreateManyStudentInputEnvelopeObjectSchema } from './EnrollmentCreateManyStudentInputEnvelope.schema';
import { EnrollmentWhereUniqueInputObjectSchema } from './EnrollmentWhereUniqueInput.schema';
import { EnrollmentUpdateWithWhereUniqueWithoutStudentInputObjectSchema } from './EnrollmentUpdateWithWhereUniqueWithoutStudentInput.schema';
import { EnrollmentUpdateManyWithWhereWithoutStudentInputObjectSchema } from './EnrollmentUpdateManyWithWhereWithoutStudentInput.schema';
import { EnrollmentScalarWhereInputObjectSchema } from './EnrollmentScalarWhereInput.schema'

export const EnrollmentUncheckedUpdateManyWithoutStudentNestedInputObjectSchema: z.ZodType<Prisma.EnrollmentUncheckedUpdateManyWithoutStudentNestedInput, z.ZodTypeDef, Prisma.EnrollmentUncheckedUpdateManyWithoutStudentNestedInput> = z.object({
  create: z.union([z.lazy(() => EnrollmentCreateWithoutStudentInputObjectSchema), z.lazy(() => EnrollmentCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => EnrollmentUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => EnrollmentUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => EnrollmentCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => EnrollmentCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => EnrollmentUpsertWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => EnrollmentUpsertWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => EnrollmentCreateManyStudentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => EnrollmentWhereUniqueInputObjectSchema), z.lazy(() => EnrollmentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => EnrollmentWhereUniqueInputObjectSchema), z.lazy(() => EnrollmentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => EnrollmentWhereUniqueInputObjectSchema), z.lazy(() => EnrollmentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => EnrollmentWhereUniqueInputObjectSchema), z.lazy(() => EnrollmentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => EnrollmentUpdateWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => EnrollmentUpdateWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => EnrollmentUpdateManyWithWhereWithoutStudentInputObjectSchema), z.lazy(() => EnrollmentUpdateManyWithWhereWithoutStudentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => EnrollmentScalarWhereInputObjectSchema), z.lazy(() => EnrollmentScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const EnrollmentUncheckedUpdateManyWithoutStudentNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => EnrollmentCreateWithoutStudentInputObjectSchema), z.lazy(() => EnrollmentCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => EnrollmentUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => EnrollmentUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => EnrollmentCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => EnrollmentCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => EnrollmentUpsertWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => EnrollmentUpsertWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => EnrollmentCreateManyStudentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => EnrollmentWhereUniqueInputObjectSchema), z.lazy(() => EnrollmentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => EnrollmentWhereUniqueInputObjectSchema), z.lazy(() => EnrollmentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => EnrollmentWhereUniqueInputObjectSchema), z.lazy(() => EnrollmentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => EnrollmentWhereUniqueInputObjectSchema), z.lazy(() => EnrollmentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => EnrollmentUpdateWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => EnrollmentUpdateWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => EnrollmentUpdateManyWithWhereWithoutStudentInputObjectSchema), z.lazy(() => EnrollmentUpdateManyWithWhereWithoutStudentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => EnrollmentScalarWhereInputObjectSchema), z.lazy(() => EnrollmentScalarWhereInputObjectSchema).array()]).optional()
}).strict();
