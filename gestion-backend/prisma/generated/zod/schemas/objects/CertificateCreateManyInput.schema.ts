import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const CertificateCreateManyInputObjectSchema: z.ZodType<Prisma.CertificateCreateManyInput, z.ZodTypeDef, Prisma.CertificateCreateManyInput> = z.object({
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
export const CertificateCreateManyInputObjectZodSchema = z.object({
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
