import { z } from 'zod';

export const GradeScalarFieldEnumSchema = z.enum(['id', 'studentId', 'ueId', 'grade', 'status', 'session', 'semester', 'level', 'academicYearId', 'createdAt', 'transcriptId', 'professeurId'])