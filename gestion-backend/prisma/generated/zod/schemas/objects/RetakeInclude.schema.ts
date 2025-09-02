import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentArgsObjectSchema } from './StudentArgs.schema';
import { UEArgsObjectSchema } from './UEArgs.schema'

export const RetakeIncludeObjectSchema: z.ZodType<Prisma.RetakeInclude, z.ZodTypeDef, Prisma.RetakeInclude> = z.object({
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional(),
  ue: z.union([z.boolean(), z.lazy(() => UEArgsObjectSchema)]).optional()
}).strict();
export const RetakeIncludeObjectZodSchema = z.object({
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional(),
  ue: z.union([z.boolean(), z.lazy(() => UEArgsObjectSchema)]).optional()
}).strict();
