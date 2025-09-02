import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { EnumStudentStatusFilterObjectSchema } from './EnumStudentStatusFilter.schema';
import { StudentStatusSchema } from '../enums/StudentStatus.schema';
import { UserNullableScalarRelationFilterObjectSchema } from './UserNullableScalarRelationFilter.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { EnrollmentListRelationFilterObjectSchema } from './EnrollmentListRelationFilter.schema';
import { GuardianListRelationFilterObjectSchema } from './GuardianListRelationFilter.schema';
import { GradeListRelationFilterObjectSchema } from './GradeListRelationFilter.schema';
import { RetakeListRelationFilterObjectSchema } from './RetakeListRelationFilter.schema';
import { PaymentListRelationFilterObjectSchema } from './PaymentListRelationFilter.schema';
import { BookLoanListRelationFilterObjectSchema } from './BookLoanListRelationFilter.schema';
import { TranscriptListRelationFilterObjectSchema } from './TranscriptListRelationFilter.schema';
import { AttendanceListRelationFilterObjectSchema } from './AttendanceListRelationFilter.schema';
import { ScholarshipApplicationListRelationFilterObjectSchema } from './ScholarshipApplicationListRelationFilter.schema';
import { CertificateListRelationFilterObjectSchema } from './CertificateListRelationFilter.schema'

export const StudentWhereInputObjectSchema: z.ZodType<Prisma.StudentWhereInput, z.ZodTypeDef, Prisma.StudentWhereInput> = z.object({
  AND: z.union([z.lazy(() => StudentWhereInputObjectSchema), z.lazy(() => StudentWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => StudentWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => StudentWhereInputObjectSchema), z.lazy(() => StudentWhereInputObjectSchema).array()]).optional(),
  firstName: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  lastName: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  email: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  phone: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  dateOfBirth: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.date()]).nullish(),
  placeOfBirth: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  address: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  photo: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  bloodGroup: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  allergies: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  disabilities: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  status: z.union([z.lazy(() => EnumStudentStatusFilterObjectSchema), StudentStatusSchema]).optional(),
  userId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  user: z.union([z.lazy(() => UserNullableScalarRelationFilterObjectSchema), z.lazy(() => UserWhereInputObjectSchema)]).nullish(),
  enrollments: z.lazy(() => EnrollmentListRelationFilterObjectSchema).optional(),
  guardians: z.lazy(() => GuardianListRelationFilterObjectSchema).optional(),
  grades: z.lazy(() => GradeListRelationFilterObjectSchema).optional(),
  retakes: z.lazy(() => RetakeListRelationFilterObjectSchema).optional(),
  payments: z.lazy(() => PaymentListRelationFilterObjectSchema).optional(),
  bookLoans: z.lazy(() => BookLoanListRelationFilterObjectSchema).optional(),
  transcripts: z.lazy(() => TranscriptListRelationFilterObjectSchema).optional(),
  attendances: z.lazy(() => AttendanceListRelationFilterObjectSchema).optional(),
  scholarshipApplications: z.lazy(() => ScholarshipApplicationListRelationFilterObjectSchema).optional(),
  certificates: z.lazy(() => CertificateListRelationFilterObjectSchema).optional()
}).strict();
export const StudentWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => StudentWhereInputObjectSchema), z.lazy(() => StudentWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => StudentWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => StudentWhereInputObjectSchema), z.lazy(() => StudentWhereInputObjectSchema).array()]).optional(),
  firstName: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  lastName: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  email: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  phone: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  dateOfBirth: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.date()]).nullish(),
  placeOfBirth: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  address: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  photo: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  bloodGroup: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  allergies: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  disabilities: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  status: z.union([z.lazy(() => EnumStudentStatusFilterObjectSchema), StudentStatusSchema]).optional(),
  userId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  user: z.union([z.lazy(() => UserNullableScalarRelationFilterObjectSchema), z.lazy(() => UserWhereInputObjectSchema)]).nullish(),
  enrollments: z.lazy(() => EnrollmentListRelationFilterObjectSchema).optional(),
  guardians: z.lazy(() => GuardianListRelationFilterObjectSchema).optional(),
  grades: z.lazy(() => GradeListRelationFilterObjectSchema).optional(),
  retakes: z.lazy(() => RetakeListRelationFilterObjectSchema).optional(),
  payments: z.lazy(() => PaymentListRelationFilterObjectSchema).optional(),
  bookLoans: z.lazy(() => BookLoanListRelationFilterObjectSchema).optional(),
  transcripts: z.lazy(() => TranscriptListRelationFilterObjectSchema).optional(),
  attendances: z.lazy(() => AttendanceListRelationFilterObjectSchema).optional(),
  scholarshipApplications: z.lazy(() => ScholarshipApplicationListRelationFilterObjectSchema).optional(),
  certificates: z.lazy(() => CertificateListRelationFilterObjectSchema).optional()
}).strict();
