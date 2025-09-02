import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const AnnouncementAttachmentOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentOrderByRelationAggregateInput, z.ZodTypeDef, Prisma.AnnouncementAttachmentOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const AnnouncementAttachmentOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
