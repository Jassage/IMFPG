import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeFindManySchema } from '../findManyGrade.schema';
import { EnrollmentFindManySchema } from '../findManyEnrollment.schema';
import { CourseAssignmentFindManySchema } from '../findManyCourseAssignment.schema';
import { PaymentFindManySchema } from '../findManyPayment.schema';
import { ScholarshipFindManySchema } from '../findManyScholarship.schema';
import { AcademicYearCountOutputTypeArgsObjectSchema } from './AcademicYearCountOutputTypeArgs.schema'

export const AcademicYearIncludeObjectSchema: z.ZodType<Prisma.AcademicYearInclude, z.ZodTypeDef, Prisma.AcademicYearInclude> = z.object({
  grades: z.union([z.boolean(), z.lazy(() => GradeFindManySchema)]).optional(),
  enrollments: z.union([z.boolean(), z.lazy(() => EnrollmentFindManySchema)]).optional(),
  assignments: z.union([z.boolean(), z.lazy(() => CourseAssignmentFindManySchema)]).optional(),
  payments: z.union([z.boolean(), z.lazy(() => PaymentFindManySchema)]).optional(),
  scholarship: z.union([z.boolean(), z.lazy(() => ScholarshipFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => AcademicYearCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const AcademicYearIncludeObjectZodSchema = z.object({
  grades: z.union([z.boolean(), z.lazy(() => GradeFindManySchema)]).optional(),
  enrollments: z.union([z.boolean(), z.lazy(() => EnrollmentFindManySchema)]).optional(),
  assignments: z.union([z.boolean(), z.lazy(() => CourseAssignmentFindManySchema)]).optional(),
  payments: z.union([z.boolean(), z.lazy(() => PaymentFindManySchema)]).optional(),
  scholarship: z.union([z.boolean(), z.lazy(() => ScholarshipFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => AcademicYearCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
