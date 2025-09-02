import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentCreateWithoutAcademicYearInputObjectSchema } from './EnrollmentCreateWithoutAcademicYearInput.schema';
import { EnrollmentUncheckedCreateWithoutAcademicYearInputObjectSchema } from './EnrollmentUncheckedCreateWithoutAcademicYearInput.schema';
import { EnrollmentCreateOrConnectWithoutAcademicYearInputObjectSchema } from './EnrollmentCreateOrConnectWithoutAcademicYearInput.schema';
import { EnrollmentUpsertWithWhereUniqueWithoutAcademicYearInputObjectSchema } from './EnrollmentUpsertWithWhereUniqueWithoutAcademicYearInput.schema';
import { EnrollmentCreateManyAcademicYearInputEnvelopeObjectSchema } from './EnrollmentCreateManyAcademicYearInputEnvelope.schema';
import { EnrollmentWhereUniqueInputObjectSchema } from './EnrollmentWhereUniqueInput.schema';
import { EnrollmentUpdateWithWhereUniqueWithoutAcademicYearInputObjectSchema } from './EnrollmentUpdateWithWhereUniqueWithoutAcademicYearInput.schema';
import { EnrollmentUpdateManyWithWhereWithoutAcademicYearInputObjectSchema } from './EnrollmentUpdateManyWithWhereWithoutAcademicYearInput.schema';
import { EnrollmentScalarWhereInputObjectSchema } from './EnrollmentScalarWhereInput.schema'

export const EnrollmentUncheckedUpdateManyWithoutAcademicYearNestedInputObjectSchema: z.ZodType<Prisma.EnrollmentUncheckedUpdateManyWithoutAcademicYearNestedInput, z.ZodTypeDef, Prisma.EnrollmentUncheckedUpdateManyWithoutAcademicYearNestedInput> = z.object({
  create: z.union([z.lazy(() => EnrollmentCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => EnrollmentCreateWithoutAcademicYearInputObjectSchema).array(), z.lazy(() => EnrollmentUncheckedCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => EnrollmentUncheckedCreateWithoutAcademicYearInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => EnrollmentCreateOrConnectWithoutAcademicYearInputObjectSchema), z.lazy(() => EnrollmentCreateOrConnectWithoutAcademicYearInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => EnrollmentUpsertWithWhereUniqueWithoutAcademicYearInputObjectSchema), z.lazy(() => EnrollmentUpsertWithWhereUniqueWithoutAcademicYearInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => EnrollmentCreateManyAcademicYearInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => EnrollmentWhereUniqueInputObjectSchema), z.lazy(() => EnrollmentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => EnrollmentWhereUniqueInputObjectSchema), z.lazy(() => EnrollmentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => EnrollmentWhereUniqueInputObjectSchema), z.lazy(() => EnrollmentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => EnrollmentWhereUniqueInputObjectSchema), z.lazy(() => EnrollmentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => EnrollmentUpdateWithWhereUniqueWithoutAcademicYearInputObjectSchema), z.lazy(() => EnrollmentUpdateWithWhereUniqueWithoutAcademicYearInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => EnrollmentUpdateManyWithWhereWithoutAcademicYearInputObjectSchema), z.lazy(() => EnrollmentUpdateManyWithWhereWithoutAcademicYearInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => EnrollmentScalarWhereInputObjectSchema), z.lazy(() => EnrollmentScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const EnrollmentUncheckedUpdateManyWithoutAcademicYearNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => EnrollmentCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => EnrollmentCreateWithoutAcademicYearInputObjectSchema).array(), z.lazy(() => EnrollmentUncheckedCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => EnrollmentUncheckedCreateWithoutAcademicYearInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => EnrollmentCreateOrConnectWithoutAcademicYearInputObjectSchema), z.lazy(() => EnrollmentCreateOrConnectWithoutAcademicYearInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => EnrollmentUpsertWithWhereUniqueWithoutAcademicYearInputObjectSchema), z.lazy(() => EnrollmentUpsertWithWhereUniqueWithoutAcademicYearInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => EnrollmentCreateManyAcademicYearInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => EnrollmentWhereUniqueInputObjectSchema), z.lazy(() => EnrollmentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => EnrollmentWhereUniqueInputObjectSchema), z.lazy(() => EnrollmentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => EnrollmentWhereUniqueInputObjectSchema), z.lazy(() => EnrollmentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => EnrollmentWhereUniqueInputObjectSchema), z.lazy(() => EnrollmentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => EnrollmentUpdateWithWhereUniqueWithoutAcademicYearInputObjectSchema), z.lazy(() => EnrollmentUpdateWithWhereUniqueWithoutAcademicYearInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => EnrollmentUpdateManyWithWhereWithoutAcademicYearInputObjectSchema), z.lazy(() => EnrollmentUpdateManyWithWhereWithoutAcademicYearInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => EnrollmentScalarWhereInputObjectSchema), z.lazy(() => EnrollmentScalarWhereInputObjectSchema).array()]).optional()
}).strict();
