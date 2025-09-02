import { z } from 'zod';

export const AttendanceScalarFieldEnumSchema = z.enum(['id', 'studentId', 'scheduleId', 'date', 'status', 'notes', 'createdAt', 'updatedAt'])