import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeOrderByRelevanceFieldEnumSchema } from '../enums/GradeOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const GradeOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.GradeOrderByRelevanceInput, z.ZodTypeDef, Prisma.GradeOrderByRelevanceInput> = z.object({
  fields: z.union([GradeOrderByRelevanceFieldEnumSchema, GradeOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const GradeOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([GradeOrderByRelevanceFieldEnumSchema, GradeOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
