import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserOrderByRelevanceFieldEnumSchema } from '../enums/UserOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const UserOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.UserOrderByRelevanceInput, z.ZodTypeDef, Prisma.UserOrderByRelevanceInput> = z.object({
  fields: z.union([UserOrderByRelevanceFieldEnumSchema, UserOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const UserOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([UserOrderByRelevanceFieldEnumSchema, UserOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
