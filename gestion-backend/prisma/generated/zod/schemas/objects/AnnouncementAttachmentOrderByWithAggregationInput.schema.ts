import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { AnnouncementAttachmentCountOrderByAggregateInputObjectSchema } from './AnnouncementAttachmentCountOrderByAggregateInput.schema';
import { AnnouncementAttachmentMaxOrderByAggregateInputObjectSchema } from './AnnouncementAttachmentMaxOrderByAggregateInput.schema';
import { AnnouncementAttachmentMinOrderByAggregateInputObjectSchema } from './AnnouncementAttachmentMinOrderByAggregateInput.schema'

export const AnnouncementAttachmentOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentOrderByWithAggregationInput, z.ZodTypeDef, Prisma.AnnouncementAttachmentOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  announcementId: SortOrderSchema.optional(),
  url: SortOrderSchema.optional(),
  _count: z.lazy(() => AnnouncementAttachmentCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => AnnouncementAttachmentMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => AnnouncementAttachmentMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const AnnouncementAttachmentOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  announcementId: SortOrderSchema.optional(),
  url: SortOrderSchema.optional(),
  _count: z.lazy(() => AnnouncementAttachmentCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => AnnouncementAttachmentMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => AnnouncementAttachmentMinOrderByAggregateInputObjectSchema).optional()
}).strict();
