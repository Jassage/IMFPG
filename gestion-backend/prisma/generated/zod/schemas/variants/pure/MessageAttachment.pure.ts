import { z } from 'zod';

// prettier-ignore
export const MessageAttachmentModelSchema = z.object({
    id: z.string(),
    messageId: z.string(),
    message: z.unknown(),
    url: z.string()
}).strict();

export type MessageAttachmentModelType = z.infer<typeof MessageAttachmentModelSchema>;
