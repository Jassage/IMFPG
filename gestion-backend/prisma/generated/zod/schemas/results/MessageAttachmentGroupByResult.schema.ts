import { z } from 'zod';
export const MessageAttachmentGroupByResultSchema = z.array(z.object({
  id: z.string(),
  messageId: z.string(),
  url: z.string(),
  _count: z.object({
    id: z.number(),
    messageId: z.number(),
    message: z.number(),
    url: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    messageId: z.string().nullable(),
    url: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    messageId: z.string().nullable(),
    url: z.string().nullable()
  }).nullable().optional()
}));