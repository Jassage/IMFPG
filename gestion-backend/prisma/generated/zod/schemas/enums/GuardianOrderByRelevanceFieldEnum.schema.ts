import { z } from 'zod';

export const GuardianOrderByRelevanceFieldEnumSchema = z.enum(['id', 'studentId', 'firstName', 'lastName', 'relationship', 'phone', 'email', 'address'])