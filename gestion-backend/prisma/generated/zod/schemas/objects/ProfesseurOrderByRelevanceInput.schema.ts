import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ProfesseurOrderByRelevanceFieldEnumSchema } from '../enums/ProfesseurOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const ProfesseurOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.ProfesseurOrderByRelevanceInput, z.ZodTypeDef, Prisma.ProfesseurOrderByRelevanceInput> = z.object({
  fields: z.union([ProfesseurOrderByRelevanceFieldEnumSchema, ProfesseurOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const ProfesseurOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([ProfesseurOrderByRelevanceFieldEnumSchema, ProfesseurOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
