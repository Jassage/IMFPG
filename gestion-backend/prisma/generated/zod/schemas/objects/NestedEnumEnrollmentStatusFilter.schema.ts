import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentStatusSchema } from '../enums/EnrollmentStatus.schema'

export const NestedEnumEnrollmentStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumEnrollmentStatusFilter, z.ZodTypeDef, Prisma.NestedEnumEnrollmentStatusFilter> = z.object({
  equals: EnrollmentStatusSchema.optional(),
  in: EnrollmentStatusSchema.array().optional(),
  notIn: EnrollmentStatusSchema.array().optional(),
  not: z.union([EnrollmentStatusSchema, z.lazy(() => NestedEnumEnrollmentStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumEnrollmentStatusFilterObjectZodSchema = z.object({
  equals: EnrollmentStatusSchema.optional(),
  in: EnrollmentStatusSchema.array().optional(),
  notIn: EnrollmentStatusSchema.array().optional(),
  not: z.union([EnrollmentStatusSchema, z.lazy(() => NestedEnumEnrollmentStatusFilterObjectSchema)]).optional()
}).strict();
