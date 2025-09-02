import { z } from 'zod';

export const PaymentOrderByRelevanceFieldEnumSchema = z.enum(['id', 'studentId', 'type', 'moyen', 'status', 'description', 'academicYearId'])