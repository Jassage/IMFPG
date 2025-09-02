import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateNestedOneWithoutCertificatesInputObjectSchema } from './StudentCreateNestedOneWithoutCertificatesInput.schema'

export const CertificateCreateInputObjectSchema: z.ZodType<Prisma.CertificateCreateInput, z.ZodTypeDef, Prisma.CertificateCreateInput> = z.object({
  id: z.string().optional(),
  type: z.string(),
  title: z.string(),
  issueDate: z.date(),
  validUntil: z.date().nullish(),
  signedBy: z.string(),
  verificationCode: z.string(),
  status: z.string(),
  student: z.lazy(() => StudentCreateNestedOneWithoutCertificatesInputObjectSchema)
}).strict();
export const CertificateCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  title: z.string(),
  issueDate: z.date(),
  validUntil: z.date().nullish(),
  signedBy: z.string(),
  verificationCode: z.string(),
  status: z.string(),
  student: z.lazy(() => StudentCreateNestedOneWithoutCertificatesInputObjectSchema)
}).strict();
