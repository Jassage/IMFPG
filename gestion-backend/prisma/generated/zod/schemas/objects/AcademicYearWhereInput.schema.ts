import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { GradeListRelationFilterObjectSchema } from './GradeListRelationFilter.schema';
import { EnrollmentListRelationFilterObjectSchema } from './EnrollmentListRelationFilter.schema';
import { CourseAssignmentListRelationFilterObjectSchema } from './CourseAssignmentListRelationFilter.schema';
import { PaymentListRelationFilterObjectSchema } from './PaymentListRelationFilter.schema';
import { ScholarshipListRelationFilterObjectSchema } from './ScholarshipListRelationFilter.schema'

export const AcademicYearWhereInputObjectSchema: z.ZodType<Prisma.AcademicYearWhereInput, z.ZodTypeDef, Prisma.AcademicYearWhereInput> = z.object({
  AND: z.union([z.lazy(() => AcademicYearWhereInputObjectSchema), z.lazy(() => AcademicYearWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AcademicYearWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AcademicYearWhereInputObjectSchema), z.lazy(() => AcademicYearWhereInputObjectSchema).array()]).optional(),
  year: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  startDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  endDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  isCurrent: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  grades: z.lazy(() => GradeListRelationFilterObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentListRelationFilterObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentListRelationFilterObjectSchema).optional(),
  payments: z.lazy(() => PaymentListRelationFilterObjectSchema).optional(),
  scholarship: z.lazy(() => ScholarshipListRelationFilterObjectSchema).optional()
}).strict();
export const AcademicYearWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => AcademicYearWhereInputObjectSchema), z.lazy(() => AcademicYearWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AcademicYearWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AcademicYearWhereInputObjectSchema), z.lazy(() => AcademicYearWhereInputObjectSchema).array()]).optional(),
  year: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  startDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  endDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  isCurrent: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  grades: z.lazy(() => GradeListRelationFilterObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentListRelationFilterObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentListRelationFilterObjectSchema).optional(),
  payments: z.lazy(() => PaymentListRelationFilterObjectSchema).optional(),
  scholarship: z.lazy(() => ScholarshipListRelationFilterObjectSchema).optional()
}).strict();
