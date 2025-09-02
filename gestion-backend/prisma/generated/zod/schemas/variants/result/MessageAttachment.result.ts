import { z } from 'zod';

// prettier-ignore
export const MessageAttachmentResultSchema = z.object({
    id: z.string(),
    messageId: z.string(),
    message: z.unknown(),
    url: z.string()
}).strict();

export type MessageAttachmentResultType = z.infer<typeof MessageAttachmentResultSchema>;
