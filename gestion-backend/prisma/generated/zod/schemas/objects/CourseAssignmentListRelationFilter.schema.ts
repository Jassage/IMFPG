import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentWhereInputObjectSchema } from './CourseAssignmentWhereInput.schema'

export const CourseAssignmentListRelationFilterObjectSchema: z.ZodType<Prisma.CourseAssignmentListRelationFilter, z.ZodTypeDef, Prisma.CourseAssignmentListRelationFilter> = z.object({
  every: z.lazy(() => CourseAssignmentWhereInputObjectSchema).optional(),
  some: z.lazy(() => CourseAssignmentWhereInputObjectSchema).optional(),
  none: z.lazy(() => CourseAssignmentWhereInputObjectSchema).optional()
}).strict();
export const CourseAssignmentListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => CourseAssignmentWhereInputObjectSchema).optional(),
  some: z.lazy(() => CourseAssignmentWhereInputObjectSchema).optional(),
  none: z.lazy(() => CourseAssignmentWhereInputObjectSchema).optional()
}).strict();
