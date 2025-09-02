import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipOrderByRelevanceFieldEnumSchema } from '../enums/ScholarshipOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const ScholarshipOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.ScholarshipOrderByRelevanceInput, z.ZodTypeDef, Prisma.ScholarshipOrderByRelevanceInput> = z.object({
  fields: z.union([ScholarshipOrderByRelevanceFieldEnumSchema, ScholarshipOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const ScholarshipOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([ScholarshipOrderByRelevanceFieldEnumSchema, ScholarshipOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
