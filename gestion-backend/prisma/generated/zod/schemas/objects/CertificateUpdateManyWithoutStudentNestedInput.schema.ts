import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CertificateCreateWithoutStudentInputObjectSchema } from './CertificateCreateWithoutStudentInput.schema';
import { CertificateUncheckedCreateWithoutStudentInputObjectSchema } from './CertificateUncheckedCreateWithoutStudentInput.schema';
import { CertificateCreateOrConnectWithoutStudentInputObjectSchema } from './CertificateCreateOrConnectWithoutStudentInput.schema';
import { CertificateUpsertWithWhereUniqueWithoutStudentInputObjectSchema } from './CertificateUpsertWithWhereUniqueWithoutStudentInput.schema';
import { CertificateCreateManyStudentInputEnvelopeObjectSchema } from './CertificateCreateManyStudentInputEnvelope.schema';
import { CertificateWhereUniqueInputObjectSchema } from './CertificateWhereUniqueInput.schema';
import { CertificateUpdateWithWhereUniqueWithoutStudentInputObjectSchema } from './CertificateUpdateWithWhereUniqueWithoutStudentInput.schema';
import { CertificateUpdateManyWithWhereWithoutStudentInputObjectSchema } from './CertificateUpdateManyWithWhereWithoutStudentInput.schema';
import { CertificateScalarWhereInputObjectSchema } from './CertificateScalarWhereInput.schema'

export const CertificateUpdateManyWithoutStudentNestedInputObjectSchema: z.ZodType<Prisma.CertificateUpdateManyWithoutStudentNestedInput, z.ZodTypeDef, Prisma.CertificateUpdateManyWithoutStudentNestedInput> = z.object({
  create: z.union([z.lazy(() => CertificateCreateWithoutStudentInputObjectSchema), z.lazy(() => CertificateCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => CertificateUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => CertificateUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CertificateCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => CertificateCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => CertificateUpsertWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => CertificateUpsertWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CertificateCreateManyStudentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => CertificateWhereUniqueInputObjectSchema), z.lazy(() => CertificateWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => CertificateWhereUniqueInputObjectSchema), z.lazy(() => CertificateWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => CertificateWhereUniqueInputObjectSchema), z.lazy(() => CertificateWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => CertificateWhereUniqueInputObjectSchema), z.lazy(() => CertificateWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => CertificateUpdateWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => CertificateUpdateWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => CertificateUpdateManyWithWhereWithoutStudentInputObjectSchema), z.lazy(() => CertificateUpdateManyWithWhereWithoutStudentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => CertificateScalarWhereInputObjectSchema), z.lazy(() => CertificateScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const CertificateUpdateManyWithoutStudentNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => CertificateCreateWithoutStudentInputObjectSchema), z.lazy(() => CertificateCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => CertificateUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => CertificateUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CertificateCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => CertificateCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => CertificateUpsertWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => CertificateUpsertWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CertificateCreateManyStudentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => CertificateWhereUniqueInputObjectSchema), z.lazy(() => CertificateWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => CertificateWhereUniqueInputObjectSchema), z.lazy(() => CertificateWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => CertificateWhereUniqueInputObjectSchema), z.lazy(() => CertificateWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => CertificateWhereUniqueInputObjectSchema), z.lazy(() => CertificateWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => CertificateUpdateWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => CertificateUpdateWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => CertificateUpdateManyWithWhereWithoutStudentInputObjectSchema), z.lazy(() => CertificateUpdateManyWithWhereWithoutStudentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => CertificateScalarWhereInputObjectSchema), z.lazy(() => CertificateScalarWhereInputObjectSchema).array()]).optional()
}).strict();
