import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const CertificateCreateWithoutStudentInputObjectSchema: z.ZodType<Prisma.CertificateCreateWithoutStudentInput, z.ZodTypeDef, Prisma.CertificateCreateWithoutStudentInput> = z.object({
  id: z.string().optional(),
  type: z.string(),
  title: z.string(),
  issueDate: z.date(),
  validUntil: z.date().nullish(),
  signedBy: z.string(),
  verificationCode: z.string(),
  status: z.string()
}).strict();
export const CertificateCreateWithoutStudentInputObjectZodSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  title: z.string(),
  issueDate: z.date(),
  validUntil: z.date().nullish(),
  signedBy: z.string(),
  verificationCode: z.string(),
  status: z.string()
}).strict();
