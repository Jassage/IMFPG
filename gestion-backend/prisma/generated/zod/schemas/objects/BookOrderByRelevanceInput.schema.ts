import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookOrderByRelevanceFieldEnumSchema } from '../enums/BookOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const BookOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.BookOrderByRelevanceInput, z.ZodTypeDef, Prisma.BookOrderByRelevanceInput> = z.object({
  fields: z.union([BookOrderByRelevanceFieldEnumSchema, BookOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const BookOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([BookOrderByRelevanceFieldEnumSchema, BookOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
