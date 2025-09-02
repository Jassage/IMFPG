import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipApplicationWhereInputObjectSchema } from './ScholarshipApplicationWhereInput.schema'

export const ScholarshipApplicationListRelationFilterObjectSchema: z.ZodType<Prisma.ScholarshipApplicationListRelationFilter, z.ZodTypeDef, Prisma.ScholarshipApplicationListRelationFilter> = z.object({
  every: z.lazy(() => ScholarshipApplicationWhereInputObjectSchema).optional(),
  some: z.lazy(() => ScholarshipApplicationWhereInputObjectSchema).optional(),
  none: z.lazy(() => ScholarshipApplicationWhereInputObjectSchema).optional()
}).strict();
export const ScholarshipApplicationListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => ScholarshipApplicationWhereInputObjectSchema).optional(),
  some: z.lazy(() => ScholarshipApplicationWhereInputObjectSchema).optional(),
  none: z.lazy(() => ScholarshipApplicationWhereInputObjectSchema).optional()
}).strict();
