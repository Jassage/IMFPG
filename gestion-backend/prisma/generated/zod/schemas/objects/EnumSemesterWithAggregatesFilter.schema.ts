import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SemesterSchema } from '../enums/Semester.schema';
import { NestedEnumSemesterWithAggregatesFilterObjectSchema } from './NestedEnumSemesterWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumSemesterFilterObjectSchema } from './NestedEnumSemesterFilter.schema'

export const EnumSemesterWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumSemesterWithAggregatesFilter, z.ZodTypeDef, Prisma.EnumSemesterWithAggregatesFilter> = z.object({
  equals: SemesterSchema.optional(),
  in: SemesterSchema.array().optional(),
  notIn: SemesterSchema.array().optional(),
  not: z.union([SemesterSchema, z.lazy(() => NestedEnumSemesterWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumSemesterFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumSemesterFilterObjectSchema).optional()
}).strict();
export const EnumSemesterWithAggregatesFilterObjectZodSchema = z.object({
  equals: SemesterSchema.optional(),
  in: SemesterSchema.array().optional(),
  notIn: SemesterSchema.array().optional(),
  not: z.union([SemesterSchema, z.lazy(() => NestedEnumSemesterWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumSemesterFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumSemesterFilterObjectSchema).optional()
}).strict();
