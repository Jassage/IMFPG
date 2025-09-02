import { z } from 'zod';

export const ScheduleOrderByRelevanceFieldEnumSchema = z.enum(['id', 'assignmentId', 'startTime', 'endTime', 'classroom', 'recurrence', 'professeurId'])