import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { TranscriptOrderByRelevanceFieldEnumSchema } from '../enums/TranscriptOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const TranscriptOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.TranscriptOrderByRelevanceInput, z.ZodTypeDef, Prisma.TranscriptOrderByRelevanceInput> = z.object({
  fields: z.union([TranscriptOrderByRelevanceFieldEnumSchema, TranscriptOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const TranscriptOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([TranscriptOrderByRelevanceFieldEnumSchema, TranscriptOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
