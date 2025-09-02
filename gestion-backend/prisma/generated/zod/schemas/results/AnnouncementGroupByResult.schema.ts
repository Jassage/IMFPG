import { z } from 'zod';
export const AnnouncementGroupByResultSchema = z.array(z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  authorId: z.string(),
  publishDate: z.date(),
  expiryDate: z.date(),
  targetAudience: z.string(),
  priority: z.string(),
  isActive: z.boolean(),
  _count: z.object({
    id: z.number(),
    title: z.number(),
    content: z.number(),
    authorId: z.number(),
    publishDate: z.number(),
    expiryDate: z.number(),
    targetAudience: z.number(),
    priority: z.number(),
    attachments: z.number(),
    isActive: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    title: z.string().nullable(),
    content: z.string().nullable(),
    authorId: z.string().nullable(),
    publishDate: z.date().nullable(),
    expiryDate: z.date().nullable(),
    targetAudience: z.string().nullable(),
    priority: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    title: z.string().nullable(),
    content: z.string().nullable(),
    authorId: z.string().nullable(),
    publishDate: z.date().nullable(),
    expiryDate: z.date().nullable(),
    targetAudience: z.string().nullable(),
    priority: z.string().nullable()
  }).nullable().optional()
}));