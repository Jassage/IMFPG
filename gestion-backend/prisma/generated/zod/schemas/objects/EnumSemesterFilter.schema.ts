import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SemesterSchema } from '../enums/Semester.schema';
import { NestedEnumSemesterFilterObjectSchema } from './NestedEnumSemesterFilter.schema'

export const EnumSemesterFilterObjectSchema: z.ZodType<Prisma.EnumSemesterFilter, z.ZodTypeDef, Prisma.EnumSemesterFilter> = z.object({
  equals: SemesterSchema.optional(),
  in: SemesterSchema.array().optional(),
  notIn: SemesterSchema.array().optional(),
  not: z.union([SemesterSchema, z.lazy(() => NestedEnumSemesterFilterObjectSchema)]).optional()
}).strict();
export const EnumSemesterFilterObjectZodSchema = z.object({
  equals: SemesterSchema.optional(),
  in: SemesterSchema.array().optional(),
  notIn: SemesterSchema.array().optional(),
  not: z.union([SemesterSchema, z.lazy(() => NestedEnumSemesterFilterObjectSchema)]).optional()
}).strict();
