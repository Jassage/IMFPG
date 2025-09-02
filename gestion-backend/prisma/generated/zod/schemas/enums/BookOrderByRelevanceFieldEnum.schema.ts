import { z } from 'zod';

export const BookOrderByRelevanceFieldEnumSchema = z.enum(['id', 'title', 'author', 'isbn', 'category', 'faculty', 'location', 'status'])