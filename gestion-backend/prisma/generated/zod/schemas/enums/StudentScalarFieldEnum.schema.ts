import { z } from 'zod';

export const StudentScalarFieldEnumSchema = z.enum(['id', 'firstName', 'lastName', 'studentId', 'email', 'phone', 'dateOfBirth', 'placeOfBirth', 'address', 'photo', 'bloodGroup', 'allergies', 'disabilities', 'status', 'userId', 'createdAt', 'updatedAt'])