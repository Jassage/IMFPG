import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEArgsObjectSchema } from './UEArgs.schema'

export const UEPrerequisiteIncludeObjectSchema: z.ZodType<Prisma.UEPrerequisiteInclude, z.ZodTypeDef, Prisma.UEPrerequisiteInclude> = z.object({
  ue: z.union([z.boolean(), z.lazy(() => UEArgsObjectSchema)]).optional(),
  prerequisite: z.union([z.boolean(), z.lazy(() => UEArgsObjectSchema)]).optional()
}).strict();
export const UEPrerequisiteIncludeObjectZodSchema = z.object({
  ue: z.union([z.boolean(), z.lazy(() => UEArgsObjectSchema)]).optional(),
  prerequisite: z.union([z.boolean(), z.lazy(() => UEArgsObjectSchema)]).optional()
}).strict();
