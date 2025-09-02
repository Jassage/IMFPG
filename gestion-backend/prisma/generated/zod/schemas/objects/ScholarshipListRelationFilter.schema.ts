import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipWhereInputObjectSchema } from './ScholarshipWhereInput.schema'

export const ScholarshipListRelationFilterObjectSchema: z.ZodType<Prisma.ScholarshipListRelationFilter, z.ZodTypeDef, Prisma.ScholarshipListRelationFilter> = z.object({
  every: z.lazy(() => ScholarshipWhereInputObjectSchema).optional(),
  some: z.lazy(() => ScholarshipWhereInputObjectSchema).optional(),
  none: z.lazy(() => ScholarshipWhereInputObjectSchema).optional()
}).strict();
export const ScholarshipListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => ScholarshipWhereInputObjectSchema).optional(),
  some: z.lazy(() => ScholarshipWhereInputObjectSchema).optional(),
  none: z.lazy(() => ScholarshipWhereInputObjectSchema).optional()
}).strict();
