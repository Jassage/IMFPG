import { z } from 'zod';

export const PaymentScalarFieldEnumSchema = z.enum(['id', 'studentId', 'amount', 'type', 'moyen', 'status', 'paidDate', 'description', 'academicYearId', 'createdAt', 'updatedAt'])