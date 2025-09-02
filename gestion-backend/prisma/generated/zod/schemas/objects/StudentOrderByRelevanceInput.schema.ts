import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentOrderByRelevanceFieldEnumSchema } from '../enums/StudentOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const StudentOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.StudentOrderByRelevanceInput, z.ZodTypeDef, Prisma.StudentOrderByRelevanceInput> = z.object({
  fields: z.union([StudentOrderByRelevanceFieldEnumSchema, StudentOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const StudentOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([StudentOrderByRelevanceFieldEnumSchema, StudentOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
