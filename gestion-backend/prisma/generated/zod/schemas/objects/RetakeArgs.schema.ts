import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeSelectObjectSchema } from './RetakeSelect.schema';
import { RetakeIncludeObjectSchema } from './RetakeInclude.schema'

export const RetakeArgsObjectSchema = z.object({
  select: z.lazy(() => RetakeSelectObjectSchema).optional(),
  include: z.lazy(() => RetakeIncludeObjectSchema).optional()
}).strict();
export const RetakeArgsObjectZodSchema = z.object({
  select: z.lazy(() => RetakeSelectObjectSchema).optional(),
  include: z.lazy(() => RetakeIncludeObjectSchema).optional()
}).strict();
