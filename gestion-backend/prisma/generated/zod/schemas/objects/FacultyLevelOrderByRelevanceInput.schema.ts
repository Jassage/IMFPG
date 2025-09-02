import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyLevelOrderByRelevanceFieldEnumSchema } from '../enums/FacultyLevelOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const FacultyLevelOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.FacultyLevelOrderByRelevanceInput, z.ZodTypeDef, Prisma.FacultyLevelOrderByRelevanceInput> = z.object({
  fields: z.union([FacultyLevelOrderByRelevanceFieldEnumSchema, FacultyLevelOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const FacultyLevelOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([FacultyLevelOrderByRelevanceFieldEnumSchema, FacultyLevelOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
