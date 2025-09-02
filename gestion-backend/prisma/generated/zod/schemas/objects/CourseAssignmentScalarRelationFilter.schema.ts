import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentWhereInputObjectSchema } from './CourseAssignmentWhereInput.schema'

export const CourseAssignmentScalarRelationFilterObjectSchema: z.ZodType<Prisma.CourseAssignmentScalarRelationFilter, z.ZodTypeDef, Prisma.CourseAssignmentScalarRelationFilter> = z.object({
  is: z.lazy(() => CourseAssignmentWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => CourseAssignmentWhereInputObjectSchema).optional()
}).strict();
export const CourseAssignmentScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => CourseAssignmentWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => CourseAssignmentWhereInputObjectSchema).optional()
}).strict();
