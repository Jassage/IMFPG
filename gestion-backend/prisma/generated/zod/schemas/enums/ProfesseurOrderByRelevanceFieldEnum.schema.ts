import { z } from 'zod';

export const ProfesseurOrderByRelevanceFieldEnumSchema = z.enum(['id', 'firstName', 'lastName', 'email', 'phone', 'department', 'office', 'speciality', 'userId'])