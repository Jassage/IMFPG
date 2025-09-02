import { z } from 'zod';

export const CourseAssignmentScalarFieldEnumSchema = z.enum(['id', 'ueId', 'facultyId', 'professeurId', 'academicYearId', 'semester', 'level', 'facultyLevelId', 'status', 'createdAt', 'updatedAt'])