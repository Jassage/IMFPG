import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { MessageOrderByRelevanceFieldEnumSchema } from '../enums/MessageOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const MessageOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.MessageOrderByRelevanceInput, z.ZodTypeDef, Prisma.MessageOrderByRelevanceInput> = z.object({
  fields: z.union([MessageOrderByRelevanceFieldEnumSchema, MessageOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const MessageOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([MessageOrderByRelevanceFieldEnumSchema, MessageOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
