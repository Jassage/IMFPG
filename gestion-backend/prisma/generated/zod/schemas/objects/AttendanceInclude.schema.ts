import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentArgsObjectSchema } from './StudentArgs.schema';
import { ScheduleArgsObjectSchema } from './ScheduleArgs.schema'

export const AttendanceIncludeObjectSchema: z.ZodType<Prisma.AttendanceInclude, z.ZodTypeDef, Prisma.AttendanceInclude> = z.object({
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional(),
  schedule: z.union([z.boolean(), z.lazy(() => ScheduleArgsObjectSchema)]).optional()
}).strict();
export const AttendanceIncludeObjectZodSchema = z.object({
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional(),
  schedule: z.union([z.boolean(), z.lazy(() => ScheduleArgsObjectSchema)]).optional()
}).strict();
