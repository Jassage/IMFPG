import { z } from 'zod';
export const AnnouncementAttachmentAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    announcementId: z.number(),
    announcement: z.number(),
    url: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    announcementId: z.string().nullable(),
    url: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    announcementId: z.string().nullable(),
    url: z.string().nullable()
  }).nullable().optional()});