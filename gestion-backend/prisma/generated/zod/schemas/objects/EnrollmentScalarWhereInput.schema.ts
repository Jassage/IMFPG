import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { EnumEnrollmentStatusFilterObjectSchema } from './EnumEnrollmentStatusFilter.schema';
import { EnrollmentStatusSchema } from '../enums/EnrollmentStatus.schema'

export const EnrollmentScalarWhereInputObjectSchema: z.ZodType<Prisma.EnrollmentScalarWhereInput, z.ZodTypeDef, Prisma.EnrollmentScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => EnrollmentScalarWhereInputObjectSchema), z.lazy(() => EnrollmentScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => EnrollmentScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => EnrollmentScalarWhereInputObjectSchema), z.lazy(() => EnrollmentScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  facultyId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  level: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  academicYearId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  enrollmentDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  status: z.union([z.lazy(() => EnumEnrollmentStatusFilterObjectSchema), EnrollmentStatusSchema]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional()
}).strict();
export const EnrollmentScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => EnrollmentScalarWhereInputObjectSchema), z.lazy(() => EnrollmentScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => EnrollmentScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => EnrollmentScalarWhereInputObjectSchema), z.lazy(() => EnrollmentScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  facultyId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  level: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  academicYearId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  enrollmentDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  status: z.union([z.lazy(() => EnumEnrollmentStatusFilterObjectSchema), EnrollmentStatusSchema]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional()
}).strict();
