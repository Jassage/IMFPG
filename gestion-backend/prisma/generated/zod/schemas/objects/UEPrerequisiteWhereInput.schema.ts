import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { UEScalarRelationFilterObjectSchema } from './UEScalarRelationFilter.schema';
import { UEWhereInputObjectSchema } from './UEWhereInput.schema'

export const UEPrerequisiteWhereInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteWhereInput, z.ZodTypeDef, Prisma.UEPrerequisiteWhereInput> = z.object({
  AND: z.union([z.lazy(() => UEPrerequisiteWhereInputObjectSchema), z.lazy(() => UEPrerequisiteWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => UEPrerequisiteWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => UEPrerequisiteWhereInputObjectSchema), z.lazy(() => UEPrerequisiteWhereInputObjectSchema).array()]).optional(),
  ueId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  prerequisiteId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  ue: z.union([z.lazy(() => UEScalarRelationFilterObjectSchema), z.lazy(() => UEWhereInputObjectSchema)]).optional(),
  prerequisite: z.union([z.lazy(() => UEScalarRelationFilterObjectSchema), z.lazy(() => UEWhereInputObjectSchema)]).optional()
}).strict();
export const UEPrerequisiteWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => UEPrerequisiteWhereInputObjectSchema), z.lazy(() => UEPrerequisiteWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => UEPrerequisiteWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => UEPrerequisiteWhereInputObjectSchema), z.lazy(() => UEPrerequisiteWhereInputObjectSchema).array()]).optional(),
  ueId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  prerequisiteId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  ue: z.union([z.lazy(() => UEScalarRelationFilterObjectSchema), z.lazy(() => UEWhereInputObjectSchema)]).optional(),
  prerequisite: z.union([z.lazy(() => UEScalarRelationFilterObjectSchema), z.lazy(() => UEWhereInputObjectSchema)]).optional()
}).strict();
