import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { ScholarshipApplicationScalarRelationFilterObjectSchema } from './ScholarshipApplicationScalarRelationFilter.schema';
import { ScholarshipApplicationWhereInputObjectSchema } from './ScholarshipApplicationWhereInput.schema'

export const ScholarshipDocumentWhereInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentWhereInput, z.ZodTypeDef, Prisma.ScholarshipDocumentWhereInput> = z.object({
  AND: z.union([z.lazy(() => ScholarshipDocumentWhereInputObjectSchema), z.lazy(() => ScholarshipDocumentWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ScholarshipDocumentWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ScholarshipDocumentWhereInputObjectSchema), z.lazy(() => ScholarshipDocumentWhereInputObjectSchema).array()]).optional(),
  scholarshipApplicationId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  url: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  scholarshipApplication: z.union([z.lazy(() => ScholarshipApplicationScalarRelationFilterObjectSchema), z.lazy(() => ScholarshipApplicationWhereInputObjectSchema)]).optional()
}).strict();
export const ScholarshipDocumentWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => ScholarshipDocumentWhereInputObjectSchema), z.lazy(() => ScholarshipDocumentWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ScholarshipDocumentWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ScholarshipDocumentWhereInputObjectSchema), z.lazy(() => ScholarshipDocumentWhereInputObjectSchema).array()]).optional(),
  scholarshipApplicationId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  url: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  scholarshipApplication: z.union([z.lazy(() => ScholarshipApplicationScalarRelationFilterObjectSchema), z.lazy(() => ScholarshipApplicationWhereInputObjectSchema)]).optional()
}).strict();
