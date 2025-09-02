import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserArgsObjectSchema } from './UserArgs.schema';
import { EnrollmentFindManySchema } from '../findManyEnrollment.schema';
import { GuardianFindManySchema } from '../findManyGuardian.schema';
import { GradeFindManySchema } from '../findManyGrade.schema';
import { RetakeFindManySchema } from '../findManyRetake.schema';
import { PaymentFindManySchema } from '../findManyPayment.schema';
import { BookLoanFindManySchema } from '../findManyBookLoan.schema';
import { TranscriptFindManySchema } from '../findManyTranscript.schema';
import { AttendanceFindManySchema } from '../findManyAttendance.schema';
import { ScholarshipApplicationFindManySchema } from '../findManyScholarshipApplication.schema';
import { CertificateFindManySchema } from '../findManyCertificate.schema';
import { StudentCountOutputTypeArgsObjectSchema } from './StudentCountOutputTypeArgs.schema'

export const StudentIncludeObjectSchema: z.ZodType<Prisma.StudentInclude, z.ZodTypeDef, Prisma.StudentInclude> = z.object({
  user: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  enrollments: z.union([z.boolean(), z.lazy(() => EnrollmentFindManySchema)]).optional(),
  guardians: z.union([z.boolean(), z.lazy(() => GuardianFindManySchema)]).optional(),
  grades: z.union([z.boolean(), z.lazy(() => GradeFindManySchema)]).optional(),
  retakes: z.union([z.boolean(), z.lazy(() => RetakeFindManySchema)]).optional(),
  payments: z.union([z.boolean(), z.lazy(() => PaymentFindManySchema)]).optional(),
  bookLoans: z.union([z.boolean(), z.lazy(() => BookLoanFindManySchema)]).optional(),
  transcripts: z.union([z.boolean(), z.lazy(() => TranscriptFindManySchema)]).optional(),
  attendances: z.union([z.boolean(), z.lazy(() => AttendanceFindManySchema)]).optional(),
  scholarshipApplications: z.union([z.boolean(), z.lazy(() => ScholarshipApplicationFindManySchema)]).optional(),
  certificates: z.union([z.boolean(), z.lazy(() => CertificateFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => StudentCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const StudentIncludeObjectZodSchema = z.object({
  user: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  enrollments: z.union([z.boolean(), z.lazy(() => EnrollmentFindManySchema)]).optional(),
  guardians: z.union([z.boolean(), z.lazy(() => GuardianFindManySchema)]).optional(),
  grades: z.union([z.boolean(), z.lazy(() => GradeFindManySchema)]).optional(),
  retakes: z.union([z.boolean(), z.lazy(() => RetakeFindManySchema)]).optional(),
  payments: z.union([z.boolean(), z.lazy(() => PaymentFindManySchema)]).optional(),
  bookLoans: z.union([z.boolean(), z.lazy(() => BookLoanFindManySchema)]).optional(),
  transcripts: z.union([z.boolean(), z.lazy(() => TranscriptFindManySchema)]).optional(),
  attendances: z.union([z.boolean(), z.lazy(() => AttendanceFindManySchema)]).optional(),
  scholarshipApplications: z.union([z.boolean(), z.lazy(() => ScholarshipApplicationFindManySchema)]).optional(),
  certificates: z.union([z.boolean(), z.lazy(() => CertificateFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => StudentCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
