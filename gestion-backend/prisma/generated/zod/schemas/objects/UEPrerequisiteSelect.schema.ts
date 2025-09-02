import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEArgsObjectSchema } from './UEArgs.schema'

export const UEPrerequisiteSelectObjectSchema: z.ZodType<Prisma.UEPrerequisiteSelect, z.ZodTypeDef, Prisma.UEPrerequisiteSelect> = z.object({
  id: z.boolean().optional(),
  ueId: z.boolean().optional(),
  prerequisiteId: z.boolean().optional(),
  ue: z.union([z.boolean(), z.lazy(() => UEArgsObjectSchema)]).optional(),
  prerequisite: z.union([z.boolean(), z.lazy(() => UEArgsObjectSchema)]).optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional()
}).strict();
export const UEPrerequisiteSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  ueId: z.boolean().optional(),
  prerequisiteId: z.boolean().optional(),
  ue: z.union([z.boolean(), z.lazy(() => UEArgsObjectSchema)]).optional(),
  prerequisite: z.union([z.boolean(), z.lazy(() => UEArgsObjectSchema)]).optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional()
}).strict();
