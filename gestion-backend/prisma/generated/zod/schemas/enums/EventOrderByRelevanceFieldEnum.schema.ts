import { z } from 'zod';

export const EventOrderByRelevanceFieldEnumSchema = z.enum(['id', 'title', 'description', 'location', 'organizer', 'category', 'status'])