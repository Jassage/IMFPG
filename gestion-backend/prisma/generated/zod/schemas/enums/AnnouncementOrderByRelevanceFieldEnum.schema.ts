import { z } from 'zod';

export const AnnouncementOrderByRelevanceFieldEnumSchema = z.enum(['id', 'title', 'content', 'authorId', 'targetAudience', 'priority'])