import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyLevelWhereInputObjectSchema } from './FacultyLevelWhereInput.schema'

export const FacultyLevelListRelationFilterObjectSchema: z.ZodType<Prisma.FacultyLevelListRelationFilter, z.ZodTypeDef, Prisma.FacultyLevelListRelationFilter> = z.object({
  every: z.lazy(() => FacultyLevelWhereInputObjectSchema).optional(),
  some: z.lazy(() => FacultyLevelWhereInputObjectSchema).optional(),
  none: z.lazy(() => FacultyLevelWhereInputObjectSchema).optional()
}).strict();
export const FacultyLevelListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => FacultyLevelWhereInputObjectSchema).optional(),
  some: z.lazy(() => FacultyLevelWhereInputObjectSchema).optional(),
  none: z.lazy(() => FacultyLevelWhereInputObjectSchema).optional()
}).strict();
