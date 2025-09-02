import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentStatusSchema } from '../enums/StudentStatus.schema';
import { NestedEnumStudentStatusFilterObjectSchema } from './NestedEnumStudentStatusFilter.schema'

export const EnumStudentStatusFilterObjectSchema: z.ZodType<Prisma.EnumStudentStatusFilter, z.ZodTypeDef, Prisma.EnumStudentStatusFilter> = z.object({
  equals: StudentStatusSchema.optional(),
  in: StudentStatusSchema.array().optional(),
  notIn: StudentStatusSchema.array().optional(),
  not: z.union([StudentStatusSchema, z.lazy(() => NestedEnumStudentStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumStudentStatusFilterObjectZodSchema = z.object({
  equals: StudentStatusSchema.optional(),
  in: StudentStatusSchema.array().optional(),
  notIn: StudentStatusSchema.array().optional(),
  not: z.union([StudentStatusSchema, z.lazy(() => NestedEnumStudentStatusFilterObjectSchema)]).optional()
}).strict();
