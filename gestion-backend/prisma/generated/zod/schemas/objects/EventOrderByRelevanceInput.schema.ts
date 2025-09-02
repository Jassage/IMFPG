import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EventOrderByRelevanceFieldEnumSchema } from '../enums/EventOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const EventOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.EventOrderByRelevanceInput, z.ZodTypeDef, Prisma.EventOrderByRelevanceInput> = z.object({
  fields: z.union([EventOrderByRelevanceFieldEnumSchema, EventOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const EventOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([EventOrderByRelevanceFieldEnumSchema, EventOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
