import { z } from 'zod';

export const BookLoanScalarFieldEnumSchema = z.enum(['id', 'bookId', 'studentId', 'loanDate', 'dueDate', 'returnDate', 'status', 'renewalCount', 'fine'])