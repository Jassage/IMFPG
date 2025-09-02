import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const CertificateMaxAggregateInputObjectSchema: z.ZodType<Prisma.CertificateMaxAggregateInputType, z.ZodTypeDef, Prisma.CertificateMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  type: z.literal(true).optional(),
  title: z.literal(true).optional(),
  issueDate: z.literal(true).optional(),
  validUntil: z.literal(true).optional(),
  signedBy: z.literal(true).optional(),
  verificationCode: z.literal(true).optional(),
  status: z.literal(true).optional()
}).strict();
export const CertificateMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  type: z.literal(true).optional(),
  title: z.literal(true).optional(),
  issueDate: z.literal(true).optional(),
  validUntil: z.literal(true).optional(),
  signedBy: z.literal(true).optional(),
  verificationCode: z.literal(true).optional(),
  status: z.literal(true).optional()
}).strict();
