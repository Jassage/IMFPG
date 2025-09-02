import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema'

export const FacultyLevelScalarWhereInputObjectSchema: z.ZodType<Prisma.FacultyLevelScalarWhereInput, z.ZodTypeDef, Prisma.FacultyLevelScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => FacultyLevelScalarWhereInputObjectSchema), z.lazy(() => FacultyLevelScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => FacultyLevelScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => FacultyLevelScalarWhereInputObjectSchema), z.lazy(() => FacultyLevelScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  facultyId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  level: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional()
}).strict();
export const FacultyLevelScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => FacultyLevelScalarWhereInputObjectSchema), z.lazy(() => FacultyLevelScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => FacultyLevelScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => FacultyLevelScalarWhereInputObjectSchema), z.lazy(() => FacultyLevelScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  facultyId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  level: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional()
}).strict();
