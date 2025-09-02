import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipApplicationOrderByRelevanceFieldEnumSchema } from '../enums/ScholarshipApplicationOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const ScholarshipApplicationOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationOrderByRelevanceInput, z.ZodTypeDef, Prisma.ScholarshipApplicationOrderByRelevanceInput> = z.object({
  fields: z.union([ScholarshipApplicationOrderByRelevanceFieldEnumSchema, ScholarshipApplicationOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const ScholarshipApplicationOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([ScholarshipApplicationOrderByRelevanceFieldEnumSchema, ScholarshipApplicationOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
