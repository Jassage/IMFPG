import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentStatusSchema } from '../enums/StudentStatus.schema';
import { NestedEnumStudentStatusWithAggregatesFilterObjectSchema } from './NestedEnumStudentStatusWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumStudentStatusFilterObjectSchema } from './NestedEnumStudentStatusFilter.schema'

export const EnumStudentStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumStudentStatusWithAggregatesFilter, z.ZodTypeDef, Prisma.EnumStudentStatusWithAggregatesFilter> = z.object({
  equals: StudentStatusSchema.optional(),
  in: StudentStatusSchema.array().optional(),
  notIn: StudentStatusSchema.array().optional(),
  not: z.union([StudentStatusSchema, z.lazy(() => NestedEnumStudentStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumStudentStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumStudentStatusFilterObjectSchema).optional()
}).strict();
export const EnumStudentStatusWithAggregatesFilterObjectZodSchema = z.object({
  equals: StudentStatusSchema.optional(),
  in: StudentStatusSchema.array().optional(),
  notIn: StudentStatusSchema.array().optional(),
  not: z.union([StudentStatusSchema, z.lazy(() => NestedEnumStudentStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumStudentStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumStudentStatusFilterObjectSchema).optional()
}).strict();
