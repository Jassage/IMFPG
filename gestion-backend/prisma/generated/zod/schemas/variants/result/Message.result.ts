import { z } from 'zod';

// prettier-ignore
export const MessageResultSchema = z.object({
    id: z.string(),
    senderId: z.string(),
    receiverId: z.string(),
    subject: z.string().nullable(),
    content: z.string(),
    timestamp: z.date(),
    isRead: z.boolean(),
    attachments: z.array(z.unknown()),
    priority: z.string()
}).strict();

export type MessageResultType = z.infer<typeof MessageResultSchema>;
