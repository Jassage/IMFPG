import { z } from 'zod';

export const TranscriptScalarFieldEnumSchema = z.enum(['id', 'studentId', 'semester', 'academicYear', 'gpa', 'totalCredits', 'creditsEarned', 'generatedDate'])