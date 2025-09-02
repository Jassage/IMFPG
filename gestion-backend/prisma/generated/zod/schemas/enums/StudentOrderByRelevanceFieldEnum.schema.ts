import { z } from 'zod';

export const StudentOrderByRelevanceFieldEnumSchema = z.enum(['id', 'firstName', 'lastName', 'studentId', 'email', 'phone', 'placeOfBirth', 'address', 'photo', 'bloodGroup', 'allergies', 'disabilities', 'userId'])