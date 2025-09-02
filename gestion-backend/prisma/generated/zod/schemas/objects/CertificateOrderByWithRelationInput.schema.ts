import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { StudentOrderByWithRelationInputObjectSchema } from './StudentOrderByWithRelationInput.schema';
import { CertificateOrderByRelevanceInputObjectSchema } from './CertificateOrderByRelevanceInput.schema'

export const CertificateOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.CertificateOrderByWithRelationInput, z.ZodTypeDef, Prisma.CertificateOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  issueDate: SortOrderSchema.optional(),
  validUntil: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  signedBy: SortOrderSchema.optional(),
  verificationCode: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  student: z.lazy(() => StudentOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => CertificateOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const CertificateOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  issueDate: SortOrderSchema.optional(),
  validUntil: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  signedBy: SortOrderSchema.optional(),
  verificationCode: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  student: z.lazy(() => StudentOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => CertificateOrderByRelevanceInputObjectSchema).optional()
}).strict();
