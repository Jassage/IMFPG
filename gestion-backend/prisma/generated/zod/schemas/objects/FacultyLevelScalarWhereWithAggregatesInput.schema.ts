import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema'

export const FacultyLevelScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.FacultyLevelScalarWhereWithAggregatesInput, z.ZodTypeDef, Prisma.FacultyLevelScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => FacultyLevelScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => FacultyLevelScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => FacultyLevelScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => FacultyLevelScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => FacultyLevelScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  facultyId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  level: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string().max(10)]).optional()
}).strict();
export const FacultyLevelScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => FacultyLevelScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => FacultyLevelScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => FacultyLevelScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => FacultyLevelScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => FacultyLevelScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  facultyId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  level: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string().max(10)]).optional()
}).strict();
