import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipApplicationWhereInputObjectSchema } from './ScholarshipApplicationWhereInput.schema'

export const ScholarshipApplicationScalarRelationFilterObjectSchema: z.ZodType<Prisma.ScholarshipApplicationScalarRelationFilter, z.ZodTypeDef, Prisma.ScholarshipApplicationScalarRelationFilter> = z.object({
  is: z.lazy(() => ScholarshipApplicationWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => ScholarshipApplicationWhereInputObjectSchema).optional()
}).strict();
export const ScholarshipApplicationScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => ScholarshipApplicationWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => ScholarshipApplicationWhereInputObjectSchema).optional()
}).strict();
