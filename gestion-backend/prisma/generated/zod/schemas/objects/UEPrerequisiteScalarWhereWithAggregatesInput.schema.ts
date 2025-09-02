import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema'

export const UEPrerequisiteScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteScalarWhereWithAggregatesInput, z.ZodTypeDef, Prisma.UEPrerequisiteScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => UEPrerequisiteScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => UEPrerequisiteScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => UEPrerequisiteScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => UEPrerequisiteScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => UEPrerequisiteScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  ueId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  prerequisiteId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional()
}).strict();
export const UEPrerequisiteScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => UEPrerequisiteScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => UEPrerequisiteScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => UEPrerequisiteScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => UEPrerequisiteScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => UEPrerequisiteScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  ueId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  prerequisiteId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional()
}).strict();
