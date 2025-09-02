import { z } from 'zod';

export const TranscriptOrderByRelevanceFieldEnumSchema = z.enum(['id', 'studentId', 'semester', 'academicYear'])