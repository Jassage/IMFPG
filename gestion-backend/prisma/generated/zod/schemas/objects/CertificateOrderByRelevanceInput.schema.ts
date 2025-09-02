import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CertificateOrderByRelevanceFieldEnumSchema } from '../enums/CertificateOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const CertificateOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.CertificateOrderByRelevanceInput, z.ZodTypeDef, Prisma.CertificateOrderByRelevanceInput> = z.object({
  fields: z.union([CertificateOrderByRelevanceFieldEnumSchema, CertificateOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const CertificateOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([CertificateOrderByRelevanceFieldEnumSchema, CertificateOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
