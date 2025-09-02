import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { AnnouncementOrderByWithRelationInputObjectSchema } from './AnnouncementOrderByWithRelationInput.schema';
import { AnnouncementAttachmentOrderByRelevanceInputObjectSchema } from './AnnouncementAttachmentOrderByRelevanceInput.schema'

export const AnnouncementAttachmentOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentOrderByWithRelationInput, z.ZodTypeDef, Prisma.AnnouncementAttachmentOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  announcementId: SortOrderSchema.optional(),
  url: SortOrderSchema.optional(),
  announcement: z.lazy(() => AnnouncementOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => AnnouncementAttachmentOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const AnnouncementAttachmentOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  announcementId: SortOrderSchema.optional(),
  url: SortOrderSchema.optional(),
  announcement: z.lazy(() => AnnouncementOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => AnnouncementAttachmentOrderByRelevanceInputObjectSchema).optional()
}).strict();
