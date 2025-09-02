import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentStatusSchema } from '../enums/StudentStatus.schema'

export const NestedEnumStudentStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumStudentStatusFilter, z.ZodTypeDef, Prisma.NestedEnumStudentStatusFilter> = z.object({
  equals: StudentStatusSchema.optional(),
  in: StudentStatusSchema.array().optional(),
  notIn: StudentStatusSchema.array().optional(),
  not: z.union([StudentStatusSchema, z.lazy(() => NestedEnumStudentStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumStudentStatusFilterObjectZodSchema = z.object({
  equals: StudentStatusSchema.optional(),
  in: StudentStatusSchema.array().optional(),
  notIn: StudentStatusSchema.array().optional(),
  not: z.union([StudentStatusSchema, z.lazy(() => NestedEnumStudentStatusFilterObjectSchema)]).optional()
}).strict();
