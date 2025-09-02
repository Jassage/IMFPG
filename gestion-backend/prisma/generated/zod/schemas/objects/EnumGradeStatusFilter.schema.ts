import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeStatusSchema } from '../enums/GradeStatus.schema';
import { NestedEnumGradeStatusFilterObjectSchema } from './NestedEnumGradeStatusFilter.schema'

export const EnumGradeStatusFilterObjectSchema: z.ZodType<Prisma.EnumGradeStatusFilter, z.ZodTypeDef, Prisma.EnumGradeStatusFilter> = z.object({
  equals: GradeStatusSchema.optional(),
  in: GradeStatusSchema.array().optional(),
  notIn: GradeStatusSchema.array().optional(),
  not: z.union([GradeStatusSchema, z.lazy(() => NestedEnumGradeStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumGradeStatusFilterObjectZodSchema = z.object({
  equals: GradeStatusSchema.optional(),
  in: GradeStatusSchema.array().optional(),
  notIn: GradeStatusSchema.array().optional(),
  not: z.union([GradeStatusSchema, z.lazy(() => NestedEnumGradeStatusFilterObjectSchema)]).optional()
}).strict();
