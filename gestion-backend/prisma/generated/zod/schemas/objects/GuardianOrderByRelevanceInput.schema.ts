import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GuardianOrderByRelevanceFieldEnumSchema } from '../enums/GuardianOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const GuardianOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.GuardianOrderByRelevanceInput, z.ZodTypeDef, Prisma.GuardianOrderByRelevanceInput> = z.object({
  fields: z.union([GuardianOrderByRelevanceFieldEnumSchema, GuardianOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const GuardianOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([GuardianOrderByRelevanceFieldEnumSchema, GuardianOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
