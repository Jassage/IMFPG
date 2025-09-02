import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CertificateWhereUniqueInputObjectSchema } from './CertificateWhereUniqueInput.schema';
import { CertificateUpdateWithoutStudentInputObjectSchema } from './CertificateUpdateWithoutStudentInput.schema';
import { CertificateUncheckedUpdateWithoutStudentInputObjectSchema } from './CertificateUncheckedUpdateWithoutStudentInput.schema'

export const CertificateUpdateWithWhereUniqueWithoutStudentInputObjectSchema: z.ZodType<Prisma.CertificateUpdateWithWhereUniqueWithoutStudentInput, z.ZodTypeDef, Prisma.CertificateUpdateWithWhereUniqueWithoutStudentInput> = z.object({
  where: z.lazy(() => CertificateWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => CertificateUpdateWithoutStudentInputObjectSchema), z.lazy(() => CertificateUncheckedUpdateWithoutStudentInputObjectSchema)])
}).strict();
export const CertificateUpdateWithWhereUniqueWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => CertificateWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => CertificateUpdateWithoutStudentInputObjectSchema), z.lazy(() => CertificateUncheckedUpdateWithoutStudentInputObjectSchema)])
}).strict();
