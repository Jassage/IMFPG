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

export const StudentSelectObjectSchema: z.ZodType<Prisma.StudentSelect, z.ZodTypeDef, Prisma.StudentSelect> = z.object({
  id: z.boolean().optional(),
  firstName: z.boolean().optional(),
  lastName: z.boolean().optional(),
  studentId: z.boolean().optional(),
  email: z.boolean().optional(),
  phone: z.boolean().optional(),
  dateOfBirth: z.boolean().optional(),
  placeOfBirth: z.boolean().optional(),
  address: z.boolean().optional(),
  photo: z.boolean().optional(),
  bloodGroup: z.boolean().optional(),
  allergies: z.boolean().optional(),
  disabilities: z.boolean().optional(),
  status: z.boolean().optional(),
  user: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  userId: z.boolean().optional(),
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
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  _count: z.union([z.boolean(), z.lazy(() => StudentCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const StudentSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  firstName: z.boolean().optional(),
  lastName: z.boolean().optional(),
  studentId: z.boolean().optional(),
  email: z.boolean().optional(),
  phone: z.boolean().optional(),
  dateOfBirth: z.boolean().optional(),
  placeOfBirth: z.boolean().optional(),
  address: z.boolean().optional(),
  photo: z.boolean().optional(),
  bloodGroup: z.boolean().optional(),
  allergies: z.boolean().optional(),
  disabilities: z.boolean().optional(),
  status: z.boolean().optional(),
  user: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  userId: z.boolean().optional(),
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
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  _count: z.union([z.boolean(), z.lazy(() => StudentCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
