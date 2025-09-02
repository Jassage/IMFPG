import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { MessageAttachmentOrderByRelationAggregateInputObjectSchema } from './MessageAttachmentOrderByRelationAggregateInput.schema';
import { MessageOrderByRelevanceInputObjectSchema } from './MessageOrderByRelevanceInput.schema'

export const MessageOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.MessageOrderByWithRelationInput, z.ZodTypeDef, Prisma.MessageOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  senderId: SortOrderSchema.optional(),
  receiverId: SortOrderSchema.optional(),
  subject: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  content: SortOrderSchema.optional(),
  timestamp: SortOrderSchema.optional(),
  isRead: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional(),
  attachments: z.lazy(() => MessageAttachmentOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => MessageOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const MessageOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  senderId: SortOrderSchema.optional(),
  receiverId: SortOrderSchema.optional(),
  subject: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  content: SortOrderSchema.optional(),
  timestamp: SortOrderSchema.optional(),
  isRead: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional(),
  attachments: z.lazy(() => MessageAttachmentOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => MessageOrderByRelevanceInputObjectSchema).optional()
}).strict();
