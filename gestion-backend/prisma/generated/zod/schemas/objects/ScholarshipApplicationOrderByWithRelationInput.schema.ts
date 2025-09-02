import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ScholarshipOrderByWithRelationInputObjectSchema } from './ScholarshipOrderByWithRelationInput.schema';
import { StudentOrderByWithRelationInputObjectSchema } from './StudentOrderByWithRelationInput.schema';
import { ScholarshipDocumentOrderByRelationAggregateInputObjectSchema } from './ScholarshipDocumentOrderByRelationAggregateInput.schema';
import { ScholarshipApplicationOrderByRelevanceInputObjectSchema } from './ScholarshipApplicationOrderByRelevanceInput.schema'

export const ScholarshipApplicationOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationOrderByWithRelationInput, z.ZodTypeDef, Prisma.ScholarshipApplicationOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  scholarshipId: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  applicationDate: SortOrderSchema.optional(),
  motivation: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  reviewNotes: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  scholarship: z.lazy(() => ScholarshipOrderByWithRelationInputObjectSchema).optional(),
  student: z.lazy(() => StudentOrderByWithRelationInputObjectSchema).optional(),
  documents: z.lazy(() => ScholarshipDocumentOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => ScholarshipApplicationOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const ScholarshipApplicationOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  scholarshipId: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  applicationDate: SortOrderSchema.optional(),
  motivation: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  reviewNotes: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  scholarship: z.lazy(() => ScholarshipOrderByWithRelationInputObjectSchema).optional(),
  student: z.lazy(() => StudentOrderByWithRelationInputObjectSchema).optional(),
  documents: z.lazy(() => ScholarshipDocumentOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => ScholarshipApplicationOrderByRelevanceInputObjectSchema).optional()
}).strict();
