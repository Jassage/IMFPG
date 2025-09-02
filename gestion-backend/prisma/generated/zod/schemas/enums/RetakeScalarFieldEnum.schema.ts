import { z } from 'zod';

export const RetakeScalarFieldEnumSchema = z.enum(['id', 'studentId', 'ueId', 'originalGrade', 'retakeGrade', 'scheduledSemester', 'status'])