import { z } from 'zod';

export const BookLoanOrderByRelevanceFieldEnumSchema = z.enum(['id', 'bookId', 'studentId', 'status'])