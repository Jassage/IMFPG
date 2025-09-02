import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SemesterSchema } from '../enums/Semester.schema';
import { NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumSemesterFilterObjectSchema } from './NestedEnumSemesterFilter.schema'

export const NestedEnumSemesterWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumSemesterWithAggregatesFilter, z.ZodTypeDef, Prisma.NestedEnumSemesterWithAggregatesFilter> = z.object({
  equals: SemesterSchema.optional(),
  in: SemesterSchema.array().optional(),
  notIn: SemesterSchema.array().optional(),
  not: z.union([SemesterSchema, z.lazy(() => NestedEnumSemesterWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumSemesterFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumSemesterFilterObjectSchema).optional()
}).strict();
export const NestedEnumSemesterWithAggregatesFilterObjectZodSchema = z.object({
  equals: SemesterSchema.optional(),
  in: SemesterSchema.array().optional(),
  notIn: SemesterSchema.array().optional(),
  not: z.union([SemesterSchema, z.lazy(() => NestedEnumSemesterWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumSemesterFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumSemesterFilterObjectSchema).optional()
}).strict();
