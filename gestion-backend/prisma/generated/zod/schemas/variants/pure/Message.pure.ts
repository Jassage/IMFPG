import { z } from 'zod';

// prettier-ignore
export const MessageModelSchema = z.object({
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

export type MessageModelType = z.infer<typeof MessageModelSchema>;
