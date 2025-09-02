import { z } from 'zod';

export const GuardianScalarFieldEnumSchema = z.enum(['id', 'studentId', 'firstName', 'lastName', 'relationship', 'phone', 'email', 'address', 'isPrimary', 'createdAt', 'updatedAt'])