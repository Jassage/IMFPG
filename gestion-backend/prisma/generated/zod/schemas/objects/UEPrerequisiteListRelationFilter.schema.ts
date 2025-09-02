import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEPrerequisiteWhereInputObjectSchema } from './UEPrerequisiteWhereInput.schema'

export const UEPrerequisiteListRelationFilterObjectSchema: z.ZodType<Prisma.UEPrerequisiteListRelationFilter, z.ZodTypeDef, Prisma.UEPrerequisiteListRelationFilter> = z.object({
  every: z.lazy(() => UEPrerequisiteWhereInputObjectSchema).optional(),
  some: z.lazy(() => UEPrerequisiteWhereInputObjectSchema).optional(),
  none: z.lazy(() => UEPrerequisiteWhereInputObjectSchema).optional()
}).strict();
export const UEPrerequisiteListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => UEPrerequisiteWhereInputObjectSchema).optional(),
  some: z.lazy(() => UEPrerequisiteWhereInputObjectSchema).optional(),
  none: z.lazy(() => UEPrerequisiteWhereInputObjectSchema).optional()
}).strict();
