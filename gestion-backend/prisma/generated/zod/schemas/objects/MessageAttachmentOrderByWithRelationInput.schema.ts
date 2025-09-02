import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { MessageOrderByWithRelationInputObjectSchema } from './MessageOrderByWithRelationInput.schema';
import { MessageAttachmentOrderByRelevanceInputObjectSchema } from './MessageAttachmentOrderByRelevanceInput.schema'

export const MessageAttachmentOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.MessageAttachmentOrderByWithRelationInput, z.ZodTypeDef, Prisma.MessageAttachmentOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  messageId: SortOrderSchema.optional(),
  url: SortOrderSchema.optional(),
  message: z.lazy(() => MessageOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => MessageAttachmentOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const MessageAttachmentOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  messageId: SortOrderSchema.optional(),
  url: SortOrderSchema.optional(),
  message: z.lazy(() => MessageOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => MessageAttachmentOrderByRelevanceInputObjectSchema).optional()
}).strict();
