import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeWhereInputObjectSchema } from './GradeWhereInput.schema'

export const GradeListRelationFilterObjectSchema: z.ZodType<Prisma.GradeListRelationFilter, z.ZodTypeDef, Prisma.GradeListRelationFilter> = z.object({
  every: z.lazy(() => GradeWhereInputObjectSchema).optional(),
  some: z.lazy(() => GradeWhereInputObjectSchema).optional(),
  none: z.lazy(() => GradeWhereInputObjectSchema).optional()
}).strict();
export const GradeListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => GradeWhereInputObjectSchema).optional(),
  some: z.lazy(() => GradeWhereInputObjectSchema).optional(),
  none: z.lazy(() => GradeWhereInputObjectSchema).optional()
}).strict();
