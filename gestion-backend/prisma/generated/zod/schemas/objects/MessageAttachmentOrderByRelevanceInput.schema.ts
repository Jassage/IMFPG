import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { MessageAttachmentOrderByRelevanceFieldEnumSchema } from '../enums/MessageAttachmentOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const MessageAttachmentOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.MessageAttachmentOrderByRelevanceInput, z.ZodTypeDef, Prisma.MessageAttachmentOrderByRelevanceInput> = z.object({
  fields: z.union([MessageAttachmentOrderByRelevanceFieldEnumSchema, MessageAttachmentOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const MessageAttachmentOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([MessageAttachmentOrderByRelevanceFieldEnumSchema, MessageAttachmentOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
