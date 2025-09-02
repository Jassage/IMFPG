import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AttendanceWhereInputObjectSchema } from './AttendanceWhereInput.schema'

export const AttendanceListRelationFilterObjectSchema: z.ZodType<Prisma.AttendanceListRelationFilter, z.ZodTypeDef, Prisma.AttendanceListRelationFilter> = z.object({
  every: z.lazy(() => AttendanceWhereInputObjectSchema).optional(),
  some: z.lazy(() => AttendanceWhereInputObjectSchema).optional(),
  none: z.lazy(() => AttendanceWhereInputObjectSchema).optional()
}).strict();
export const AttendanceListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => AttendanceWhereInputObjectSchema).optional(),
  some: z.lazy(() => AttendanceWhereInputObjectSchema).optional(),
  none: z.lazy(() => AttendanceWhereInputObjectSchema).optional()
}).strict();
