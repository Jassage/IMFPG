import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const CertificateUncheckedCreateInputObjectSchema: z.ZodType<Prisma.CertificateUncheckedCreateInput, z.ZodTypeDef, Prisma.CertificateUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  type: z.string(),
  title: z.string(),
  issueDate: z.date(),
  validUntil: z.date().nullish(),
  signedBy: z.string(),
  verificationCode: z.string(),
  status: z.string()
}).strict();
export const CertificateUncheckedCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  type: z.string(),
  title: z.string(),
  issueDate: z.date(),
  validUntil: z.date().nullish(),
  signedBy: z.string(),
  verificationCode: z.string(),
  status: z.string()
}).strict();
