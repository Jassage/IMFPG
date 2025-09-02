import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CertificateCreateManyStudentInputObjectSchema } from './CertificateCreateManyStudentInput.schema'

export const CertificateCreateManyStudentInputEnvelopeObjectSchema: z.ZodType<Prisma.CertificateCreateManyStudentInputEnvelope, z.ZodTypeDef, Prisma.CertificateCreateManyStudentInputEnvelope> = z.object({
  data: z.union([z.lazy(() => CertificateCreateManyStudentInputObjectSchema), z.lazy(() => CertificateCreateManyStudentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const CertificateCreateManyStudentInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => CertificateCreateManyStudentInputObjectSchema), z.lazy(() => CertificateCreateManyStudentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
