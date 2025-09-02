import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { StudentOrderByWithRelationInputObjectSchema } from './StudentOrderByWithRelationInput.schema';
import { ScheduleOrderByWithRelationInputObjectSchema } from './ScheduleOrderByWithRelationInput.schema';
import { AttendanceOrderByRelevanceInputObjectSchema } from './AttendanceOrderByRelevanceInput.schema'

export const AttendanceOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.AttendanceOrderByWithRelationInput, z.ZodTypeDef, Prisma.AttendanceOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  scheduleId: SortOrderSchema.optional(),
  date: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  notes: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  student: z.lazy(() => StudentOrderByWithRelationInputObjectSchema).optional(),
  schedule: z.lazy(() => ScheduleOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => AttendanceOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const AttendanceOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  scheduleId: SortOrderSchema.optional(),
  date: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  notes: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  student: z.lazy(() => StudentOrderByWithRelationInputObjectSchema).optional(),
  schedule: z.lazy(() => ScheduleOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => AttendanceOrderByRelevanceInputObjectSchema).optional()
}).strict();
