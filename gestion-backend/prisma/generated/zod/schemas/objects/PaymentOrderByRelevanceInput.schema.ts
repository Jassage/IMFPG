import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { PaymentOrderByRelevanceFieldEnumSchema } from '../enums/PaymentOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const PaymentOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.PaymentOrderByRelevanceInput, z.ZodTypeDef, Prisma.PaymentOrderByRelevanceInput> = z.object({
  fields: z.union([PaymentOrderByRelevanceFieldEnumSchema, PaymentOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const PaymentOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([PaymentOrderByRelevanceFieldEnumSchema, PaymentOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
