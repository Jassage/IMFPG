import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AnalyticsOrderByRelevanceFieldEnumSchema } from '../enums/AnalyticsOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const AnalyticsOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.AnalyticsOrderByRelevanceInput, z.ZodTypeDef, Prisma.AnalyticsOrderByRelevanceInput> = z.object({
  fields: z.union([AnalyticsOrderByRelevanceFieldEnumSchema, AnalyticsOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const AnalyticsOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([AnalyticsOrderByRelevanceFieldEnumSchema, AnalyticsOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
