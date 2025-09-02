import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const AnnouncementAttachmentMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentMinOrderByAggregateInput, z.ZodTypeDef, Prisma.AnnouncementAttachmentMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  announcementId: SortOrderSchema.optional(),
  url: SortOrderSchema.optional()
}).strict();
export const AnnouncementAttachmentMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  announcementId: SortOrderSchema.optional(),
  url: SortOrderSchema.optional()
}).strict();
