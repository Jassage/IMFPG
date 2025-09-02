import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const CertificateMinAggregateInputObjectSchema: z.ZodType<Prisma.CertificateMinAggregateInputType, z.ZodTypeDef, Prisma.CertificateMinAggregateInputType> = z.object({
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
export const CertificateMinAggregateInputObjectZodSchema = z.object({
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
