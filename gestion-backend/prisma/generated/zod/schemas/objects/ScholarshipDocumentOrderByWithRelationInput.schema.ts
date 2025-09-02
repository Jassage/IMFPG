import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { ScholarshipApplicationOrderByWithRelationInputObjectSchema } from './ScholarshipApplicationOrderByWithRelationInput.schema';
import { ScholarshipDocumentOrderByRelevanceInputObjectSchema } from './ScholarshipDocumentOrderByRelevanceInput.schema'

export const ScholarshipDocumentOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentOrderByWithRelationInput, z.ZodTypeDef, Prisma.ScholarshipDocumentOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  scholarshipApplicationId: SortOrderSchema.optional(),
  url: SortOrderSchema.optional(),
  scholarshipApplication: z.lazy(() => ScholarshipApplicationOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => ScholarshipDocumentOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const ScholarshipDocumentOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  scholarshipApplicationId: SortOrderSchema.optional(),
  url: SortOrderSchema.optional(),
  scholarshipApplication: z.lazy(() => ScholarshipApplicationOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => ScholarshipDocumentOrderByRelevanceInputObjectSchema).optional()
}).strict();
