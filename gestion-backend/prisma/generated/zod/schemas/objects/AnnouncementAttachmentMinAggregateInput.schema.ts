import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AnnouncementAttachmentMinAggregateInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentMinAggregateInputType, z.ZodTypeDef, Prisma.AnnouncementAttachmentMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  announcementId: z.literal(true).optional(),
  url: z.literal(true).optional()
}).strict();
export const AnnouncementAttachmentMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  announcementId: z.literal(true).optional(),
  url: z.literal(true).optional()
}).strict();
