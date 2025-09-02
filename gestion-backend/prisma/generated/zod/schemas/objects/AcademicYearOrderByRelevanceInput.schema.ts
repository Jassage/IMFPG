import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearOrderByRelevanceFieldEnumSchema } from '../enums/AcademicYearOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const AcademicYearOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.AcademicYearOrderByRelevanceInput, z.ZodTypeDef, Prisma.AcademicYearOrderByRelevanceInput> = z.object({
  fields: z.union([AcademicYearOrderByRelevanceFieldEnumSchema, AcademicYearOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const AcademicYearOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([AcademicYearOrderByRelevanceFieldEnumSchema, AcademicYearOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
