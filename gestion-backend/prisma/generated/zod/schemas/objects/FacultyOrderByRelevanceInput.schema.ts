import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyOrderByRelevanceFieldEnumSchema } from '../enums/FacultyOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const FacultyOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.FacultyOrderByRelevanceInput, z.ZodTypeDef, Prisma.FacultyOrderByRelevanceInput> = z.object({
  fields: z.union([FacultyOrderByRelevanceFieldEnumSchema, FacultyOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const FacultyOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([FacultyOrderByRelevanceFieldEnumSchema, FacultyOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
