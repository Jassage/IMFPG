import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { AnnouncementAttachmentOrderByRelationAggregateInputObjectSchema } from './AnnouncementAttachmentOrderByRelationAggregateInput.schema';
import { AnnouncementOrderByRelevanceInputObjectSchema } from './AnnouncementOrderByRelevanceInput.schema'

export const AnnouncementOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.AnnouncementOrderByWithRelationInput, z.ZodTypeDef, Prisma.AnnouncementOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  content: SortOrderSchema.optional(),
  authorId: SortOrderSchema.optional(),
  publishDate: SortOrderSchema.optional(),
  expiryDate: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  targetAudience: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  attachments: z.lazy(() => AnnouncementAttachmentOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => AnnouncementOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const AnnouncementOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  content: SortOrderSchema.optional(),
  authorId: SortOrderSchema.optional(),
  publishDate: SortOrderSchema.optional(),
  expiryDate: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  targetAudience: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  attachments: z.lazy(() => AnnouncementAttachmentOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => AnnouncementOrderByRelevanceInputObjectSchema).optional()
}).strict();
