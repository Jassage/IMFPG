import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeFindManySchema } from '../findManyGrade.schema';
import { EnrollmentFindManySchema } from '../findManyEnrollment.schema';
import { CourseAssignmentFindManySchema } from '../findManyCourseAssignment.schema';
import { PaymentFindManySchema } from '../findManyPayment.schema';
import { ScholarshipFindManySchema } from '../findManyScholarship.schema';
import { AcademicYearCountOutputTypeArgsObjectSchema } from './AcademicYearCountOutputTypeArgs.schema'

export const AcademicYearSelectObjectSchema: z.ZodType<Prisma.AcademicYearSelect, z.ZodTypeDef, Prisma.AcademicYearSelect> = z.object({
  id: z.boolean().optional(),
  year: z.boolean().optional(),
  startDate: z.boolean().optional(),
  endDate: z.boolean().optional(),
  isCurrent: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  grades: z.union([z.boolean(), z.lazy(() => GradeFindManySchema)]).optional(),
  enrollments: z.union([z.boolean(), z.lazy(() => EnrollmentFindManySchema)]).optional(),
  assignments: z.union([z.boolean(), z.lazy(() => CourseAssignmentFindManySchema)]).optional(),
  payments: z.union([z.boolean(), z.lazy(() => PaymentFindManySchema)]).optional(),
  scholarship: z.union([z.boolean(), z.lazy(() => ScholarshipFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => AcademicYearCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const AcademicYearSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  year: z.boolean().optional(),
  startDate: z.boolean().optional(),
  endDate: z.boolean().optional(),
  isCurrent: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  grades: z.union([z.boolean(), z.lazy(() => GradeFindManySchema)]).optional(),
  enrollments: z.union([z.boolean(), z.lazy(() => EnrollmentFindManySchema)]).optional(),
  assignments: z.union([z.boolean(), z.lazy(() => CourseAssignmentFindManySchema)]).optional(),
  payments: z.union([z.boolean(), z.lazy(() => PaymentFindManySchema)]).optional(),
  scholarship: z.union([z.boolean(), z.lazy(() => ScholarshipFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => AcademicYearCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
