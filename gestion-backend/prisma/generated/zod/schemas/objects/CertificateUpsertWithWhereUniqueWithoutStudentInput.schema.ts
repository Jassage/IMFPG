import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CertificateWhereUniqueInputObjectSchema } from './CertificateWhereUniqueInput.schema';
import { CertificateUpdateWithoutStudentInputObjectSchema } from './CertificateUpdateWithoutStudentInput.schema';
import { CertificateUncheckedUpdateWithoutStudentInputObjectSchema } from './CertificateUncheckedUpdateWithoutStudentInput.schema';
import { CertificateCreateWithoutStudentInputObjectSchema } from './CertificateCreateWithoutStudentInput.schema';
import { CertificateUncheckedCreateWithoutStudentInputObjectSchema } from './CertificateUncheckedCreateWithoutStudentInput.schema'

export const CertificateUpsertWithWhereUniqueWithoutStudentInputObjectSchema: z.ZodType<Prisma.CertificateUpsertWithWhereUniqueWithoutStudentInput, z.ZodTypeDef, Prisma.CertificateUpsertWithWhereUniqueWithoutStudentInput> = z.object({
  where: z.lazy(() => CertificateWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => CertificateUpdateWithoutStudentInputObjectSchema), z.lazy(() => CertificateUncheckedUpdateWithoutStudentInputObjectSchema)]),
  create: z.union([z.lazy(() => CertificateCreateWithoutStudentInputObjectSchema), z.lazy(() => CertificateUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
export const CertificateUpsertWithWhereUniqueWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => CertificateWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => CertificateUpdateWithoutStudentInputObjectSchema), z.lazy(() => CertificateUncheckedUpdateWithoutStudentInputObjectSchema)]),
  create: z.union([z.lazy(() => CertificateCreateWithoutStudentInputObjectSchema), z.lazy(() => CertificateUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
