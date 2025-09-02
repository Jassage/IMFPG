import { z } from 'zod';

// prettier-ignore
export const MessageInputSchema = z.object({
    senderId: z.string(),
    receiverId: z.string(),
    subject: z.string().optional().nullable(),
    content: z.string(),
    timestamp: z.date(),
    isRead: z.boolean(),
    attachments: z.array(z.unknown()),
    priority: z.string()
}).strict();

export type MessageInputType = z.infer<typeof MessageInputSchema>;
