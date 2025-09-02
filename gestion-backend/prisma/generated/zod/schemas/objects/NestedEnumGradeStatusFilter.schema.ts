import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeStatusSchema } from '../enums/GradeStatus.schema'

export const NestedEnumGradeStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumGradeStatusFilter, z.ZodTypeDef, Prisma.NestedEnumGradeStatusFilter> = z.object({
  equals: GradeStatusSchema.optional(),
  in: GradeStatusSchema.array().optional(),
  notIn: GradeStatusSchema.array().optional(),
  not: z.union([GradeStatusSchema, z.lazy(() => NestedEnumGradeStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumGradeStatusFilterObjectZodSchema = z.object({
  equals: GradeStatusSchema.optional(),
  in: GradeStatusSchema.array().optional(),
  notIn: GradeStatusSchema.array().optional(),
  not: z.union([GradeStatusSchema, z.lazy(() => NestedEnumGradeStatusFilterObjectSchema)]).optional()
}).strict();
