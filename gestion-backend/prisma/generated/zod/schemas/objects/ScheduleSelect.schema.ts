import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentArgsObjectSchema } from './CourseAssignmentArgs.schema';
import { ProfesseurArgsObjectSchema } from './ProfesseurArgs.schema';
import { AttendanceFindManySchema } from '../findManyAttendance.schema';
import { ScheduleCountOutputTypeArgsObjectSchema } from './ScheduleCountOutputTypeArgs.schema'

export const ScheduleSelectObjectSchema: z.ZodType<Prisma.ScheduleSelect, z.ZodTypeDef, Prisma.ScheduleSelect> = z.object({
  id: z.boolean().optional(),
  assignment: z.union([z.boolean(), z.lazy(() => CourseAssignmentArgsObjectSchema)]).optional(),
  assignmentId: z.boolean().optional(),
  dayOfWeek: z.boolean().optional(),
  startTime: z.boolean().optional(),
  endTime: z.boolean().optional(),
  classroom: z.boolean().optional(),
  recurrence: z.boolean().optional(),
  exceptions: z.boolean().optional(),
  professeur: z.union([z.boolean(), z.lazy(() => ProfesseurArgsObjectSchema)]).optional(),
  professeurId: z.boolean().optional(),
  attendances: z.union([z.boolean(), z.lazy(() => AttendanceFindManySchema)]).optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  _count: z.union([z.boolean(), z.lazy(() => ScheduleCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ScheduleSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  assignment: z.union([z.boolean(), z.lazy(() => CourseAssignmentArgsObjectSchema)]).optional(),
  assignmentId: z.boolean().optional(),
  dayOfWeek: z.boolean().optional(),
  startTime: z.boolean().optional(),
  endTime: z.boolean().optional(),
  classroom: z.boolean().optional(),
  recurrence: z.boolean().optional(),
  exceptions: z.boolean().optional(),
  professeur: z.union([z.boolean(), z.lazy(() => ProfesseurArgsObjectSchema)]).optional(),
  professeurId: z.boolean().optional(),
  attendances: z.union([z.boolean(), z.lazy(() => AttendanceFindManySchema)]).optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  _count: z.union([z.boolean(), z.lazy(() => ScheduleCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
