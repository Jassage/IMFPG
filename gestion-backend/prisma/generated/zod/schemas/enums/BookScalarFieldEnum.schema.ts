import { z } from 'zod';

export const BookScalarFieldEnumSchema = z.enum(['id', 'title', 'author', 'isbn', 'category', 'faculty', 'quantity', 'available', 'location', 'status'])