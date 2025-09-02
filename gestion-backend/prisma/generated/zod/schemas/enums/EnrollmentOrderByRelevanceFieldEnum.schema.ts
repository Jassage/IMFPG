import { z } from 'zod';

export const EnrollmentOrderByRelevanceFieldEnumSchema = z.enum(['id', 'studentId', 'facultyId', 'level', 'academicYearId'])