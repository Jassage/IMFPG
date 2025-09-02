import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipDocumentOrderByRelevanceFieldEnumSchema } from '../enums/ScholarshipDocumentOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const ScholarshipDocumentOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentOrderByRelevanceInput, z.ZodTypeDef, Prisma.ScholarshipDocumentOrderByRelevanceInput> = z.object({
  fields: z.union([ScholarshipDocumentOrderByRelevanceFieldEnumSchema, ScholarshipDocumentOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const ScholarshipDocumentOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([ScholarshipDocumentOrderByRelevanceFieldEnumSchema, ScholarshipDocumentOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
