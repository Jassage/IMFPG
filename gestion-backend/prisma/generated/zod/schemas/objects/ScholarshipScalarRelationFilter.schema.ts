import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipWhereInputObjectSchema } from './ScholarshipWhereInput.schema'

export const ScholarshipScalarRelationFilterObjectSchema: z.ZodType<Prisma.ScholarshipScalarRelationFilter, z.ZodTypeDef, Prisma.ScholarshipScalarRelationFilter> = z.object({
  is: z.lazy(() => ScholarshipWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => ScholarshipWhereInputObjectSchema).optional()
}).strict();
export const ScholarshipScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => ScholarshipWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => ScholarshipWhereInputObjectSchema).optional()
}).strict();
