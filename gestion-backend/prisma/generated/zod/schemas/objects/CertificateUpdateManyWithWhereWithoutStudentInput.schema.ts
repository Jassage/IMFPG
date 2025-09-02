import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CertificateScalarWhereInputObjectSchema } from './CertificateScalarWhereInput.schema';
import { CertificateUpdateManyMutationInputObjectSchema } from './CertificateUpdateManyMutationInput.schema';
import { CertificateUncheckedUpdateManyWithoutStudentInputObjectSchema } from './CertificateUncheckedUpdateManyWithoutStudentInput.schema'

export const CertificateUpdateManyWithWhereWithoutStudentInputObjectSchema: z.ZodType<Prisma.CertificateUpdateManyWithWhereWithoutStudentInput, z.ZodTypeDef, Prisma.CertificateUpdateManyWithWhereWithoutStudentInput> = z.object({
  where: z.lazy(() => CertificateScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => CertificateUpdateManyMutationInputObjectSchema), z.lazy(() => CertificateUncheckedUpdateManyWithoutStudentInputObjectSchema)])
}).strict();
export const CertificateUpdateManyWithWhereWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => CertificateScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => CertificateUpdateManyMutationInputObjectSchema), z.lazy(() => CertificateUncheckedUpdateManyWithoutStudentInputObjectSchema)])
}).strict();
