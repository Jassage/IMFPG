import { z } from 'zod';

export const FacultyOrderByRelevanceFieldEnumSchema = z.enum(['id', 'name', 'code', 'description', 'dean', 'status'])