import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { UserOrderByWithRelationInputObjectSchema } from './UserOrderByWithRelationInput.schema';
import { CourseAssignmentOrderByRelationAggregateInputObjectSchema } from './CourseAssignmentOrderByRelationAggregateInput.schema';
import { ScheduleOrderByRelationAggregateInputObjectSchema } from './ScheduleOrderByRelationAggregateInput.schema';
import { GradeOrderByRelationAggregateInputObjectSchema } from './GradeOrderByRelationAggregateInput.schema';
import { ProfesseurOrderByRelevanceInputObjectSchema } from './ProfesseurOrderByRelevanceInput.schema'

export const ProfesseurOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.ProfesseurOrderByWithRelationInput, z.ZodTypeDef, Prisma.ProfesseurOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  firstName: SortOrderSchema.optional(),
  lastName: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  phone: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  department: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  office: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  hireDate: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  speciality: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  userId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  user: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentOrderByRelationAggregateInputObjectSchema).optional(),
  schedules: z.lazy(() => ScheduleOrderByRelationAggregateInputObjectSchema).optional(),
  grades: z.lazy(() => GradeOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => ProfesseurOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const ProfesseurOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  firstName: SortOrderSchema.optional(),
  lastName: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  phone: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  department: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  office: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  hireDate: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  speciality: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  userId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  user: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentOrderByRelationAggregateInputObjectSchema).optional(),
  schedules: z.lazy(() => ScheduleOrderByRelationAggregateInputObjectSchema).optional(),
  grades: z.lazy(() => GradeOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => ProfesseurOrderByRelevanceInputObjectSchema).optional()
}).strict();
