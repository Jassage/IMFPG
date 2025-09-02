import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookLoanOrderByRelevanceFieldEnumSchema } from '../enums/BookLoanOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const BookLoanOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.BookLoanOrderByRelevanceInput, z.ZodTypeDef, Prisma.BookLoanOrderByRelevanceInput> = z.object({
  fields: z.union([BookLoanOrderByRelevanceFieldEnumSchema, BookLoanOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const BookLoanOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([BookLoanOrderByRelevanceFieldEnumSchema, BookLoanOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
