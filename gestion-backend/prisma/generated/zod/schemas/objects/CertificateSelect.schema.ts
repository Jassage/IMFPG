import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentArgsObjectSchema } from './StudentArgs.schema'

export const CertificateSelectObjectSchema: z.ZodType<Prisma.CertificateSelect, z.ZodTypeDef, Prisma.CertificateSelect> = z.object({
  id: z.boolean().optional(),
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional(),
  studentId: z.boolean().optional(),
  type: z.boolean().optional(),
  title: z.boolean().optional(),
  issueDate: z.boolean().optional(),
  validUntil: z.boolean().optional(),
  signedBy: z.boolean().optional(),
  verificationCode: z.boolean().optional(),
  status: z.boolean().optional()
}).strict();
export const CertificateSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional(),
  studentId: z.boolean().optional(),
  type: z.boolean().optional(),
  title: z.boolean().optional(),
  issueDate: z.boolean().optional(),
  validUntil: z.boolean().optional(),
  signedBy: z.boolean().optional(),
  verificationCode: z.boolean().optional(),
  status: z.boolean().optional()
}).strict();
