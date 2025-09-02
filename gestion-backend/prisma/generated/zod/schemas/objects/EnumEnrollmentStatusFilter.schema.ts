import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentStatusSchema } from '../enums/EnrollmentStatus.schema';
import { NestedEnumEnrollmentStatusFilterObjectSchema } from './NestedEnumEnrollmentStatusFilter.schema'

export const EnumEnrollmentStatusFilterObjectSchema: z.ZodType<Prisma.EnumEnrollmentStatusFilter, z.ZodTypeDef, Prisma.EnumEnrollmentStatusFilter> = z.object({
  equals: EnrollmentStatusSchema.optional(),
  in: EnrollmentStatusSchema.array().optional(),
  notIn: EnrollmentStatusSchema.array().optional(),
  not: z.union([EnrollmentStatusSchema, z.lazy(() => NestedEnumEnrollmentStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumEnrollmentStatusFilterObjectZodSchema = z.object({
  equals: EnrollmentStatusSchema.optional(),
  in: EnrollmentStatusSchema.array().optional(),
  notIn: EnrollmentStatusSchema.array().optional(),
  not: z.union([EnrollmentStatusSchema, z.lazy(() => NestedEnumEnrollmentStatusFilterObjectSchema)]).optional()
}).strict();
