import { z } from 'zod';

export const AnnouncementScalarFieldEnumSchema = z.enum(['id', 'title', 'content', 'authorId', 'publishDate', 'expiryDate', 'targetAudience', 'priority', 'isActive'])