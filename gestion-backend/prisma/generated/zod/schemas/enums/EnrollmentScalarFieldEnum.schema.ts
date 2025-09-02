import { z } from 'zod';

export const EnrollmentScalarFieldEnumSchema = z.enum(['id', 'studentId', 'facultyId', 'level', 'academicYearId', 'enrollmentDate', 'status', 'createdAt', 'updatedAt'])