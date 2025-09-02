import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { AcademicYearOrderByWithRelationInputObjectSchema } from './AcademicYearOrderByWithRelationInput.schema';
import { ScholarshipApplicationOrderByRelationAggregateInputObjectSchema } from './ScholarshipApplicationOrderByRelationAggregateInput.schema';
import { ScholarshipOrderByRelevanceInputObjectSchema } from './ScholarshipOrderByRelevanceInput.schema'

export const ScholarshipOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.ScholarshipOrderByWithRelationInput, z.ZodTypeDef, Prisma.ScholarshipOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  amount: SortOrderSchema.optional(),
  criteria: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  applicationDeadline: SortOrderSchema.optional(),
  academicYearId: SortOrderSchema.optional(),
  maxRecipients: SortOrderSchema.optional(),
  currentRecipients: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  academicYear: z.lazy(() => AcademicYearOrderByWithRelationInputObjectSchema).optional(),
  applications: z.lazy(() => ScholarshipApplicationOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => ScholarshipOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const ScholarshipOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  amount: SortOrderSchema.optional(),
  criteria: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  applicationDeadline: SortOrderSchema.optional(),
  academicYearId: SortOrderSchema.optional(),
  maxRecipients: SortOrderSchema.optional(),
  currentRecipients: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  academicYear: z.lazy(() => AcademicYearOrderByWithRelationInputObjectSchema).optional(),
  applications: z.lazy(() => ScholarshipApplicationOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => ScholarshipOrderByRelevanceInputObjectSchema).optional()
}).strict();
