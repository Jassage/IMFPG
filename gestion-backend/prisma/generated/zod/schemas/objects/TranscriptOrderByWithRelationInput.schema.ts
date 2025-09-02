import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { StudentOrderByWithRelationInputObjectSchema } from './StudentOrderByWithRelationInput.schema';
import { GradeOrderByRelationAggregateInputObjectSchema } from './GradeOrderByRelationAggregateInput.schema';
import { TranscriptOrderByRelevanceInputObjectSchema } from './TranscriptOrderByRelevanceInput.schema'

export const TranscriptOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.TranscriptOrderByWithRelationInput, z.ZodTypeDef, Prisma.TranscriptOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  semester: SortOrderSchema.optional(),
  academicYear: SortOrderSchema.optional(),
  gpa: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  totalCredits: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  creditsEarned: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  generatedDate: SortOrderSchema.optional(),
  student: z.lazy(() => StudentOrderByWithRelationInputObjectSchema).optional(),
  grades: z.lazy(() => GradeOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => TranscriptOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const TranscriptOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  semester: SortOrderSchema.optional(),
  academicYear: SortOrderSchema.optional(),
  gpa: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  totalCredits: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  creditsEarned: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  generatedDate: SortOrderSchema.optional(),
  student: z.lazy(() => StudentOrderByWithRelationInputObjectSchema).optional(),
  grades: z.lazy(() => GradeOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => TranscriptOrderByRelevanceInputObjectSchema).optional()
}).strict();
