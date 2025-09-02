import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEPrerequisiteOrderByRelevanceFieldEnumSchema } from '../enums/UEPrerequisiteOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const UEPrerequisiteOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteOrderByRelevanceInput, z.ZodTypeDef, Prisma.UEPrerequisiteOrderByRelevanceInput> = z.object({
  fields: z.union([UEPrerequisiteOrderByRelevanceFieldEnumSchema, UEPrerequisiteOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const UEPrerequisiteOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([UEPrerequisiteOrderByRelevanceFieldEnumSchema, UEPrerequisiteOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
