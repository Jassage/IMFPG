import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const AnnouncementAttachmentCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentCountOrderByAggregateInput, z.ZodTypeDef, Prisma.AnnouncementAttachmentCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  announcementId: SortOrderSchema.optional(),
  url: SortOrderSchema.optional()
}).strict();
export const AnnouncementAttachmentCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  announcementId: SortOrderSchema.optional(),
  url: SortOrderSchema.optional()
}).strict();
