import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema'

export const ScholarshipDocumentScalarWhereInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentScalarWhereInput, z.ZodTypeDef, Prisma.ScholarshipDocumentScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => ScholarshipDocumentScalarWhereInputObjectSchema), z.lazy(() => ScholarshipDocumentScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ScholarshipDocumentScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ScholarshipDocumentScalarWhereInputObjectSchema), z.lazy(() => ScholarshipDocumentScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  scholarshipApplicationId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  url: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional()
}).strict();
export const ScholarshipDocumentScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => ScholarshipDocumentScalarWhereInputObjectSchema), z.lazy(() => ScholarshipDocumentScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ScholarshipDocumentScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ScholarshipDocumentScalarWhereInputObjectSchema), z.lazy(() => ScholarshipDocumentScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  scholarshipApplicationId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  url: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional()
}).strict();
