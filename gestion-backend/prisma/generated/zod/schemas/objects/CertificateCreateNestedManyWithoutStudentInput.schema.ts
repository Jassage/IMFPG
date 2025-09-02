import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CertificateCreateWithoutStudentInputObjectSchema } from './CertificateCreateWithoutStudentInput.schema';
import { CertificateUncheckedCreateWithoutStudentInputObjectSchema } from './CertificateUncheckedCreateWithoutStudentInput.schema';
import { CertificateCreateOrConnectWithoutStudentInputObjectSchema } from './CertificateCreateOrConnectWithoutStudentInput.schema';
import { CertificateCreateManyStudentInputEnvelopeObjectSchema } from './CertificateCreateManyStudentInputEnvelope.schema';
import { CertificateWhereUniqueInputObjectSchema } from './CertificateWhereUniqueInput.schema'

export const CertificateCreateNestedManyWithoutStudentInputObjectSchema: z.ZodType<Prisma.CertificateCreateNestedManyWithoutStudentInput, z.ZodTypeDef, Prisma.CertificateCreateNestedManyWithoutStudentInput> = z.object({
  create: z.union([z.lazy(() => CertificateCreateWithoutStudentInputObjectSchema), z.lazy(() => CertificateCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => CertificateUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => CertificateUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CertificateCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => CertificateCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CertificateCreateManyStudentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => CertificateWhereUniqueInputObjectSchema), z.lazy(() => CertificateWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const CertificateCreateNestedManyWithoutStudentInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => CertificateCreateWithoutStudentInputObjectSchema), z.lazy(() => CertificateCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => CertificateUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => CertificateUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CertificateCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => CertificateCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CertificateCreateManyStudentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => CertificateWhereUniqueInputObjectSchema), z.lazy(() => CertificateWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
