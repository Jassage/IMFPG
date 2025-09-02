import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CertificateWhereUniqueInputObjectSchema } from './CertificateWhereUniqueInput.schema';
import { CertificateCreateWithoutStudentInputObjectSchema } from './CertificateCreateWithoutStudentInput.schema';
import { CertificateUncheckedCreateWithoutStudentInputObjectSchema } from './CertificateUncheckedCreateWithoutStudentInput.schema'

export const CertificateCreateOrConnectWithoutStudentInputObjectSchema: z.ZodType<Prisma.CertificateCreateOrConnectWithoutStudentInput, z.ZodTypeDef, Prisma.CertificateCreateOrConnectWithoutStudentInput> = z.object({
  where: z.lazy(() => CertificateWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CertificateCreateWithoutStudentInputObjectSchema), z.lazy(() => CertificateUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
export const CertificateCreateOrConnectWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => CertificateWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CertificateCreateWithoutStudentInputObjectSchema), z.lazy(() => CertificateUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
