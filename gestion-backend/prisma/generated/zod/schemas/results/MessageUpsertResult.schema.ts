import { z } from 'zod';
export const MessageUpsertResultSchema = z.object({
  id: z.string(),
  senderId: z.string(),
  receiverId: z.string(),
  subject: z.string().optional(),
  content: z.string(),
  timestamp: z.date(),
  isRead: z.boolean(),
  attachments: z.array(z.unknown()),
  priority: z.string()
});