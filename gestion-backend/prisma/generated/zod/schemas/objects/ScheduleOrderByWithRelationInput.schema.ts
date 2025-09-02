import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { CourseAssignmentOrderByWithRelationInputObjectSchema } from './CourseAssignmentOrderByWithRelationInput.schema';
import { ProfesseurOrderByWithRelationInputObjectSchema } from './ProfesseurOrderByWithRelationInput.schema';
import { AttendanceOrderByRelationAggregateInputObjectSchema } from './AttendanceOrderByRelationAggregateInput.schema';
import { ScheduleOrderByRelevanceInputObjectSchema } from './ScheduleOrderByRelevanceInput.schema'

export const ScheduleOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.ScheduleOrderByWithRelationInput, z.ZodTypeDef, Prisma.ScheduleOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  assignmentId: SortOrderSchema.optional(),
  dayOfWeek: SortOrderSchema.optional(),
  startTime: SortOrderSchema.optional(),
  endTime: SortOrderSchema.optional(),
  classroom: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  recurrence: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  exceptions: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  professeurId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  assignment: z.lazy(() => CourseAssignmentOrderByWithRelationInputObjectSchema).optional(),
  professeur: z.lazy(() => ProfesseurOrderByWithRelationInputObjectSchema).optional(),
  attendances: z.lazy(() => AttendanceOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => ScheduleOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const ScheduleOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  assignmentId: SortOrderSchema.optional(),
  dayOfWeek: SortOrderSchema.optional(),
  startTime: SortOrderSchema.optional(),
  endTime: SortOrderSchema.optional(),
  classroom: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  recurrence: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  exceptions: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  professeurId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  assignment: z.lazy(() => CourseAssignmentOrderByWithRelationInputObjectSchema).optional(),
  professeur: z.lazy(() => ProfesseurOrderByWithRelationInputObjectSchema).optional(),
  attendances: z.lazy(() => AttendanceOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => ScheduleOrderByRelevanceInputObjectSchema).optional()
}).strict();
