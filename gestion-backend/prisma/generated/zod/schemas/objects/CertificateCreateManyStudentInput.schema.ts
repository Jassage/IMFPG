import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const CertificateCreateManyStudentInputObjectSchema: z.ZodType<Prisma.CertificateCreateManyStudentInput, z.ZodTypeDef, Prisma.CertificateCreateManyStudentInput> = z.object({
  id: z.string().optional(),
  type: z.string(),
  title: z.string(),
  issueDate: z.date(),
  validUntil: z.date().nullish(),
  signedBy: z.string(),
  verificationCode: z.string(),
  status: z.string()
}).strict();
export const CertificateCreateManyStudentInputObjectZodSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  title: z.string(),
  issueDate: z.date(),
  validUntil: z.date().nullish(),
  signedBy: z.string(),
  verificationCode: z.string(),
  status: z.string()
}).strict();
