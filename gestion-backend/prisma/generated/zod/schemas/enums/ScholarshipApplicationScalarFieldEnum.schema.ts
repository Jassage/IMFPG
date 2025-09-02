import { z } from 'zod';

export const ScholarshipApplicationScalarFieldEnumSchema = z.enum(['id', 'scholarshipId', 'studentId', 'applicationDate', 'motivation', 'status', 'reviewNotes'])