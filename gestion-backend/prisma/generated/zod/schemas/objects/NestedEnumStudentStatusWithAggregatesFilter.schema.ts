import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentStatusSchema } from '../enums/StudentStatus.schema';
import { NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumStudentStatusFilterObjectSchema } from './NestedEnumStudentStatusFilter.schema'

export const NestedEnumStudentStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumStudentStatusWithAggregatesFilter, z.ZodTypeDef, Prisma.NestedEnumStudentStatusWithAggregatesFilter> = z.object({
  equals: StudentStatusSchema.optional(),
  in: StudentStatusSchema.array().optional(),
  notIn: StudentStatusSchema.array().optional(),
  not: z.union([StudentStatusSchema, z.lazy(() => NestedEnumStudentStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumStudentStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumStudentStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumStudentStatusWithAggregatesFilterObjectZodSchema = z.object({
  equals: StudentStatusSchema.optional(),
  in: StudentStatusSchema.array().optional(),
  notIn: StudentStatusSchema.array().optional(),
  not: z.union([StudentStatusSchema, z.lazy(() => NestedEnumStudentStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumStudentStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumStudentStatusFilterObjectSchema).optional()
}).strict();
