import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipDocumentWhereInputObjectSchema } from './ScholarshipDocumentWhereInput.schema'

export const ScholarshipDocumentListRelationFilterObjectSchema: z.ZodType<Prisma.ScholarshipDocumentListRelationFilter, z.ZodTypeDef, Prisma.ScholarshipDocumentListRelationFilter> = z.object({
  every: z.lazy(() => ScholarshipDocumentWhereInputObjectSchema).optional(),
  some: z.lazy(() => ScholarshipDocumentWhereInputObjectSchema).optional(),
  none: z.lazy(() => ScholarshipDocumentWhereInputObjectSchema).optional()
}).strict();
export const ScholarshipDocumentListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => ScholarshipDocumentWhereInputObjectSchema).optional(),
  some: z.lazy(() => ScholarshipDocumentWhereInputObjectSchema).optional(),
  none: z.lazy(() => ScholarshipDocumentWhereInputObjectSchema).optional()
}).strict();
