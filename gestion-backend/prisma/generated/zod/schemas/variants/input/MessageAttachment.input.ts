import { z } from 'zod';

// prettier-ignore
export const MessageAttachmentInputSchema = z.object({
    messageId: z.string(),
    message: z.unknown(),
    url: z.string()
}).strict();

export type MessageAttachmentInputType = z.infer<typeof MessageAttachmentInputSchema>;
