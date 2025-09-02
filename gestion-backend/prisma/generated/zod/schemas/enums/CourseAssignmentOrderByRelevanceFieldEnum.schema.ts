import { z } from 'zod';

export const CourseAssignmentOrderByRelevanceFieldEnumSchema = z.enum(['id', 'ueId', 'facultyId', 'professeurId', 'academicYearId', 'level', 'facultyLevelId', 'status'])