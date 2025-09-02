import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AttendanceSelectObjectSchema } from './AttendanceSelect.schema';
import { AttendanceIncludeObjectSchema } from './AttendanceInclude.schema'

export const AttendanceArgsObjectSchema = z.object({
  select: z.lazy(() => AttendanceSelectObjectSchema).optional(),
  include: z.lazy(() => AttendanceIncludeObjectSchema).optional()
}).strict();
export const AttendanceArgsObjectZodSchema = z.object({
  select: z.lazy(() => AttendanceSelectObjectSchema).optional(),
  include: z.lazy(() => AttendanceIncludeObjectSchema).optional()
}).strict();
