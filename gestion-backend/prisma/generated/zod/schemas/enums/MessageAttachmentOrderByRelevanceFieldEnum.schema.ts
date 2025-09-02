import { z } from 'zod';

export const MessageAttachmentOrderByRelevanceFieldEnumSchema = z.enum(['id', 'messageId', 'url'])