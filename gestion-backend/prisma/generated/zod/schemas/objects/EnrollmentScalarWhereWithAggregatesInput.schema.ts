import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { EnumEnrollmentStatusWithAggregatesFilterObjectSchema } from './EnumEnrollmentStatusWithAggregatesFilter.schema';
import { EnrollmentStatusSchema } from '../enums/EnrollmentStatus.schema'

export const EnrollmentScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.EnrollmentScalarWhereWithAggregatesInput, z.ZodTypeDef, Prisma.EnrollmentScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => EnrollmentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => EnrollmentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => EnrollmentScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => EnrollmentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => EnrollmentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  studentId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  facultyId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  level: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  academicYearId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  enrollmentDate: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.date()]).optional(),
  status: z.union([z.lazy(() => EnumEnrollmentStatusWithAggregatesFilterObjectSchema), EnrollmentStatusSchema]).optional()
}).strict();
export const EnrollmentScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => EnrollmentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => EnrollmentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => EnrollmentScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => EnrollmentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => EnrollmentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  studentId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  facultyId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  level: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  academicYearId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  enrollmentDate: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.date()]).optional(),
  status: z.union([z.lazy(() => EnumEnrollmentStatusWithAggregatesFilterObjectSchema), EnrollmentStatusSchema]).optional()
}).strict();
