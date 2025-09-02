import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AnnouncementAttachmentCountAggregateInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentCountAggregateInputType, z.ZodTypeDef, Prisma.AnnouncementAttachmentCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  announcementId: z.literal(true).optional(),
  url: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const AnnouncementAttachmentCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  announcementId: z.literal(true).optional(),
  url: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
