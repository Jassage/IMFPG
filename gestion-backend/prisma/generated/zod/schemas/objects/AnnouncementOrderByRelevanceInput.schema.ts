import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AnnouncementOrderByRelevanceFieldEnumSchema } from '../enums/AnnouncementOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const AnnouncementOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.AnnouncementOrderByRelevanceInput, z.ZodTypeDef, Prisma.AnnouncementOrderByRelevanceInput> = z.object({
  fields: z.union([AnnouncementOrderByRelevanceFieldEnumSchema, AnnouncementOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const AnnouncementOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([AnnouncementOrderByRelevanceFieldEnumSchema, AnnouncementOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
