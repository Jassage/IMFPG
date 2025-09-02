import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const CertificateCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CertificateCountOrderByAggregateInput, z.ZodTypeDef, Prisma.CertificateCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  issueDate: SortOrderSchema.optional(),
  validUntil: SortOrderSchema.optional(),
  signedBy: SortOrderSchema.optional(),
  verificationCode: SortOrderSchema.optional(),
  status: SortOrderSchema.optional()
}).strict();
export const CertificateCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  issueDate: SortOrderSchema.optional(),
  validUntil: SortOrderSchema.optional(),
  signedBy: SortOrderSchema.optional(),
  verificationCode: SortOrderSchema.optional(),
  status: SortOrderSchema.optional()
}).strict();
