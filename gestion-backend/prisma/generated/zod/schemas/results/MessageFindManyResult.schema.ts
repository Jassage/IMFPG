import { z } from 'zod';
export const MessageFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  senderId: z.string(),
  receiverId: z.string(),
  subject: z.string().optional(),
  content: z.string(),
  timestamp: z.date(),
  isRead: z.boolean(),
  attachments: z.array(z.unknown()),
  priority: z.string()
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});