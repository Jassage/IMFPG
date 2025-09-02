import { z } from 'zod';

export const MessageOrderByRelevanceFieldEnumSchema = z.enum(['id', 'senderId', 'receiverId', 'subject', 'content', 'priority'])