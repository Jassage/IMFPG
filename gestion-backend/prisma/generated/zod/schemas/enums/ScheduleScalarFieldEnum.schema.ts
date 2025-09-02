import { z } from 'zod';

export const ScheduleScalarFieldEnumSchema = z.enum(['id', 'assignmentId', 'dayOfWeek', 'startTime', 'endTime', 'classroom', 'recurrence', 'exceptions', 'professeurId', 'createdAt', 'updatedAt'])