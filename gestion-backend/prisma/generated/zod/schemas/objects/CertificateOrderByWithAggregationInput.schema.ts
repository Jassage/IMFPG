import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { CertificateCountOrderByAggregateInputObjectSchema } from './CertificateCountOrderByAggregateInput.schema';
import { CertificateMaxOrderByAggregateInputObjectSchema } from './CertificateMaxOrderByAggregateInput.schema';
import { CertificateMinOrderByAggregateInputObjectSchema } from './CertificateMinOrderByAggregateInput.schema'

export const CertificateOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.CertificateOrderByWithAggregationInput, z.ZodTypeDef, Prisma.CertificateOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  issueDate: SortOrderSchema.optional(),
  validUntil: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  signedBy: SortOrderSchema.optional(),
  verificationCode: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  _count: z.lazy(() => CertificateCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => CertificateMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => CertificateMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const CertificateOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  issueDate: SortOrderSchema.optional(),
  validUntil: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  signedBy: SortOrderSchema.optional(),
  verificationCode: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  _count: z.lazy(() => CertificateCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => CertificateMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => CertificateMinOrderByAggregateInputObjectSchema).optional()
}).strict();
