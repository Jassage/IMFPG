import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AnnouncementAttachmentMaxAggregateInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentMaxAggregateInputType, z.ZodTypeDef, Prisma.AnnouncementAttachmentMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  announcementId: z.literal(true).optional(),
  url: z.literal(true).optional()
}).strict();
export const AnnouncementAttachmentMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  announcementId: z.literal(true).optional(),
  url: z.literal(true).optional()
}).strict();
