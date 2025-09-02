import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AnnouncementAttachmentOrderByRelevanceFieldEnumSchema } from '../enums/AnnouncementAttachmentOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const AnnouncementAttachmentOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentOrderByRelevanceInput, z.ZodTypeDef, Prisma.AnnouncementAttachmentOrderByRelevanceInput> = z.object({
  fields: z.union([AnnouncementAttachmentOrderByRelevanceFieldEnumSchema, AnnouncementAttachmentOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const AnnouncementAttachmentOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([AnnouncementAttachmentOrderByRelevanceFieldEnumSchema, AnnouncementAttachmentOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
