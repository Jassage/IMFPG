import { z } from 'zod';

export const ScholarshipApplicationOrderByRelevanceFieldEnumSchema = z.enum(['id', 'scholarshipId', 'studentId', 'motivation', 'status', 'reviewNotes'])