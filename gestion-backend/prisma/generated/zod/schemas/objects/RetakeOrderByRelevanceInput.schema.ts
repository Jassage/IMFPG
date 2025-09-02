import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeOrderByRelevanceFieldEnumSchema } from '../enums/RetakeOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const RetakeOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.RetakeOrderByRelevanceInput, z.ZodTypeDef, Prisma.RetakeOrderByRelevanceInput> = z.object({
  fields: z.union([RetakeOrderByRelevanceFieldEnumSchema, RetakeOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const RetakeOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([RetakeOrderByRelevanceFieldEnumSchema, RetakeOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
