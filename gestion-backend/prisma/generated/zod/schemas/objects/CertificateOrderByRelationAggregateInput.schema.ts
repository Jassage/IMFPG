import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const CertificateOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.CertificateOrderByRelationAggregateInput, z.ZodTypeDef, Prisma.CertificateOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const CertificateOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
