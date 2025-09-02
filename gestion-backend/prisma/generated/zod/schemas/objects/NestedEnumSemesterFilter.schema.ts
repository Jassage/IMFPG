import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SemesterSchema } from '../enums/Semester.schema'

export const NestedEnumSemesterFilterObjectSchema: z.ZodType<Prisma.NestedEnumSemesterFilter, z.ZodTypeDef, Prisma.NestedEnumSemesterFilter> = z.object({
  equals: SemesterSchema.optional(),
  in: SemesterSchema.array().optional(),
  notIn: SemesterSchema.array().optional(),
  not: z.union([SemesterSchema, z.lazy(() => NestedEnumSemesterFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumSemesterFilterObjectZodSchema = z.object({
  equals: SemesterSchema.optional(),
  in: SemesterSchema.array().optional(),
  notIn: SemesterSchema.array().optional(),
  not: z.union([SemesterSchema, z.lazy(() => NestedEnumSemesterFilterObjectSchema)]).optional()
}).strict();
