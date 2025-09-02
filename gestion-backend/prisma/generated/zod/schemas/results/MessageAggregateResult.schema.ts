import { z } from 'zod';
export const MessageAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    senderId: z.number(),
    receiverId: z.number(),
    subject: z.number(),
    content: z.number(),
    timestamp: z.number(),
    isRead: z.number(),
    attachments: z.number(),
    priority: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    senderId: z.string().nullable(),
    receiverId: z.string().nullable(),
    subject: z.string().nullable(),
    content: z.string().nullable(),
    timestamp: z.date().nullable(),
    priority: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    senderId: z.string().nullable(),
    receiverId: z.string().nullable(),
    subject: z.string().nullable(),
    content: z.string().nullable(),
    timestamp: z.date().nullable(),
    priority: z.string().nullable()
  }).nullable().optional()});