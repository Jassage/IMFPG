import { z } from 'zod';

export const FacultyScalarFieldEnumSchema = z.enum(['id', 'name', 'code', 'description', 'dean', 'studentsCount', 'coursesCount', 'studyDuration', 'status', 'createdAt', 'updatedAt'])