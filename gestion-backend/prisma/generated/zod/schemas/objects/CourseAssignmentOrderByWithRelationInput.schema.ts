import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { UEOrderByWithRelationInputObjectSchema } from './UEOrderByWithRelationInput.schema';
import { FacultyOrderByWithRelationInputObjectSchema } from './FacultyOrderByWithRelationInput.schema';
import { ProfesseurOrderByWithRelationInputObjectSchema } from './ProfesseurOrderByWithRelationInput.schema';
import { AcademicYearOrderByWithRelationInputObjectSchema } from './AcademicYearOrderByWithRelationInput.schema';
import { FacultyLevelOrderByWithRelationInputObjectSchema } from './FacultyLevelOrderByWithRelationInput.schema';
import { ScheduleOrderByRelationAggregateInputObjectSchema } from './ScheduleOrderByRelationAggregateInput.schema';
import { CourseAssignmentOrderByRelevanceInputObjectSchema } from './CourseAssignmentOrderByRelevanceInput.schema'

export const CourseAssignmentOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.CourseAssignmentOrderByWithRelationInput, z.ZodTypeDef, Prisma.CourseAssignmentOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  ueId: SortOrderSchema.optional(),
  facultyId: SortOrderSchema.optional(),
  professeurId: SortOrderSchema.optional(),
  academicYearId: SortOrderSchema.optional(),
  semester: SortOrderSchema.optional(),
  level: SortOrderSchema.optional(),
  facultyLevelId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  ue: z.lazy(() => UEOrderByWithRelationInputObjectSchema).optional(),
  faculty: z.lazy(() => FacultyOrderByWithRelationInputObjectSchema).optional(),
  professeur: z.lazy(() => ProfesseurOrderByWithRelationInputObjectSchema).optional(),
  academicYear: z.lazy(() => AcademicYearOrderByWithRelationInputObjectSchema).optional(),
  facultyLevel: z.lazy(() => FacultyLevelOrderByWithRelationInputObjectSchema).optional(),
  schedules: z.lazy(() => ScheduleOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => CourseAssignmentOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const CourseAssignmentOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  ueId: SortOrderSchema.optional(),
  facultyId: SortOrderSchema.optional(),
  professeurId: SortOrderSchema.optional(),
  academicYearId: SortOrderSchema.optional(),
  semester: SortOrderSchema.optional(),
  level: SortOrderSchema.optional(),
  facultyLevelId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  ue: z.lazy(() => UEOrderByWithRelationInputObjectSchema).optional(),
  faculty: z.lazy(() => FacultyOrderByWithRelationInputObjectSchema).optional(),
  professeur: z.lazy(() => ProfesseurOrderByWithRelationInputObjectSchema).optional(),
  academicYear: z.lazy(() => AcademicYearOrderByWithRelationInputObjectSchema).optional(),
  facultyLevel: z.lazy(() => FacultyLevelOrderByWithRelationInputObjectSchema).optional(),
  schedules: z.lazy(() => ScheduleOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => CourseAssignmentOrderByRelevanceInputObjectSchema).optional()
}).strict();
