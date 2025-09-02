import { z } from 'zod';

export const RetakeOrderByRelevanceFieldEnumSchema = z.enum(['id', 'studentId', 'ueId', 'scheduledSemester'])