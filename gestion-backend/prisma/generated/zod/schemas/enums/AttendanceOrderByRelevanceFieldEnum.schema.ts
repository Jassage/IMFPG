import { z } from 'zod';

export const AttendanceOrderByRelevanceFieldEnumSchema = z.enum(['id', 'studentId', 'scheduleId', 'status', 'notes'])