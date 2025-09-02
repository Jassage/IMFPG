import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const CertificateUncheckedCreateWithoutStudentInputObjectSchema: z.ZodType<Prisma.CertificateUncheckedCreateWithoutStudentInput, z.ZodTypeDef, Prisma.CertificateUncheckedCreateWithoutStudentInput> = z.object({
  id: z.string().optional(),
  type: z.string(),
  title: z.string(),
  issueDate: z.date(),
  validUntil: z.date().nullish(),
  signedBy: z.string(),
  verificationCode: z.string(),
  status: z.string()
}).strict();
export const CertificateUncheckedCreateWithoutStudentInputObjectZodSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  title: z.string(),
  issueDate: z.date(),
  validUntil: z.date().nullish(),
  signedBy: z.string(),
  verificationCode: z.string(),
  status: z.string()
}).strict();
