import { z } from 'zod';

export const MessageScalarFieldEnumSchema = z.enum(['id', 'senderId', 'receiverId', 'subject', 'content', 'timestamp', 'isRead', 'priority'])