import { z } from 'zod';

export const GradeOrderByRelevanceFieldEnumSchema = z.enum(['id', 'studentId', 'ueId', 'semester', 'level', 'academicYearId', 'transcriptId', 'professeurId'])