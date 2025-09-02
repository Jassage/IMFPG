import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const AnnouncementAttachmentMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentMaxOrderByAggregateInput, z.ZodTypeDef, Prisma.AnnouncementAttachmentMaxOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  announcementId: SortOrderSchema.optional(),
  url: SortOrderSchema.optional()
}).strict();
export const AnnouncementAttachmentMaxOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  announcementId: SortOrderSchema.optional(),
  url: SortOrderSchema.optional()
}).strict();
