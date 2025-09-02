import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEOrderByRelevanceFieldEnumSchema } from '../enums/UEOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const UEOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.UEOrderByRelevanceInput, z.ZodTypeDef, Prisma.UEOrderByRelevanceInput> = z.object({
  fields: z.union([UEOrderByRelevanceFieldEnumSchema, UEOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const UEOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([UEOrderByRelevanceFieldEnumSchema, UEOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
