import { z } from 'zod';

export const ScholarshipOrderByRelevanceFieldEnumSchema = z.enum(['id', 'name', 'description', 'criteria', 'academicYearId', 'status'])