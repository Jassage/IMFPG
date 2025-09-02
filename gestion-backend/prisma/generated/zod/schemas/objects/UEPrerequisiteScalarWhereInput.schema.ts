import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

export const UEPrerequisiteScalarWhereInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteScalarWhereInput, z.ZodTypeDef, Prisma.UEPrerequisiteScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => UEPrerequisiteScalarWhereInputObjectSchema), z.lazy(() => UEPrerequisiteScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => UEPrerequisiteScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => UEPrerequisiteScalarWhereInputObjectSchema), z.lazy(() => UEPrerequisiteScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  ueId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  prerequisiteId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional()
}).strict();
export const UEPrerequisiteScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => UEPrerequisiteScalarWhereInputObjectSchema), z.lazy(() => UEPrerequisiteScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => UEPrerequisiteScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => UEPrerequisiteScalarWhereInputObjectSchema), z.lazy(() => UEPrerequisiteScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  ueId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  prerequisiteId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional()
}).strict();
