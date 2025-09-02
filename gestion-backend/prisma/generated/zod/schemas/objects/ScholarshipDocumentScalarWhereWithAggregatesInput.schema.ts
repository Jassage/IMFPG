import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema'

export const ScholarshipDocumentScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentScalarWhereWithAggregatesInput, z.ZodTypeDef, Prisma.ScholarshipDocumentScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => ScholarshipDocumentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ScholarshipDocumentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ScholarshipDocumentScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ScholarshipDocumentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ScholarshipDocumentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  scholarshipApplicationId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  url: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional()
}).strict();
export const ScholarshipDocumentScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => ScholarshipDocumentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ScholarshipDocumentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ScholarshipDocumentScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ScholarshipDocumentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ScholarshipDocumentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  scholarshipApplicationId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  url: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional()
}).strict();
