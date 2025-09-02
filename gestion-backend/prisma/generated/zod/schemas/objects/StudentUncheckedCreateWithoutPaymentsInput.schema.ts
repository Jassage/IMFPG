import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentStatusSchema } from '../enums/StudentStatus.schema';
import { EnrollmentUncheckedCreateNestedManyWithoutStudentInputObjectSchema } from './EnrollmentUncheckedCreateNestedManyWithoutStudentInput.schema';
import { GuardianUncheckedCreateNestedManyWithoutStudentInputObjectSchema } from './GuardianUncheckedCreateNestedManyWithoutStudentInput.schema';
import { GradeUncheckedCreateNestedManyWithoutStudentInputObjectSchema } from './GradeUncheckedCreateNestedManyWithoutStudentInput.schema';
import { RetakeUncheckedCreateNestedManyWithoutStudentInputObjectSchema } from './RetakeUncheckedCreateNestedManyWithoutStudentInput.schema';
import { BookLoanUncheckedCreateNestedManyWithoutStudentInputObjectSchema } from './BookLoanUncheckedCreateNestedManyWithoutStudentInput.schema';
import { TranscriptUncheckedCreateNestedManyWithoutStudentInputObjectSchema } from './TranscriptUncheckedCreateNestedManyWithoutStudentInput.schema';
import { AttendanceUncheckedCreateNestedManyWithoutStudentInputObjectSchema } from './AttendanceUncheckedCreateNestedManyWithoutStudentInput.schema';
import { ScholarshipApplicationUncheckedCreateNestedManyWithoutStudentInputObjectSchema } from './ScholarshipApplicationUncheckedCreateNestedManyWithoutStudentInput.schema';
import { CertificateUncheckedCreateNestedManyWithoutStudentInputObjectSchema } from './CertificateUncheckedCreateNestedManyWithoutStudentInput.schema'

export const StudentUncheckedCreateWithoutPaymentsInputObjectSchema: z.ZodType<Prisma.StudentUncheckedCreateWithoutPaymentsInput, z.ZodTypeDef, Prisma.StudentUncheckedCreateWithoutPaymentsInput> = z.object({
  id: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  studentId: z.string(),
  email: z.string(),
  phone: z.string().nullish(),
  dateOfBirth: z.date().nullish(),
  placeOfBirth: z.string().nullish(),
  address: z.string().nullish(),
  photo: z.string().nullish(),
  bloodGroup: z.string().nullish(),
  allergies: z.string().nullish(),
  disabilities: z.string().nullish(),
  status: StudentStatusSchema.optional(),
  userId: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  enrollments: z.lazy(() => EnrollmentUncheckedCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  guardians: z.lazy(() => GuardianUncheckedCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  grades: z.lazy(() => GradeUncheckedCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  retakes: z.lazy(() => RetakeUncheckedCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  bookLoans: z.lazy(() => BookLoanUncheckedCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  transcripts: z.lazy(() => TranscriptUncheckedCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  attendances: z.lazy(() => AttendanceUncheckedCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  scholarshipApplications: z.lazy(() => ScholarshipApplicationUncheckedCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  certificates: z.lazy(() => CertificateUncheckedCreateNestedManyWithoutStudentInputObjectSchema).optional()
}).strict();
export const StudentUncheckedCreateWithoutPaymentsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  studentId: z.string(),
  email: z.string(),
  phone: z.string().nullish(),
  dateOfBirth: z.date().nullish(),
  placeOfBirth: z.string().nullish(),
  address: z.string().nullish(),
  photo: z.string().nullish(),
  bloodGroup: z.string().nullish(),
  allergies: z.string().nullish(),
  disabilities: z.string().nullish(),
  status: StudentStatusSchema.optional(),
  userId: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  enrollments: z.lazy(() => EnrollmentUncheckedCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  guardians: z.lazy(() => GuardianUncheckedCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  grades: z.lazy(() => GradeUncheckedCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  retakes: z.lazy(() => RetakeUncheckedCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  bookLoans: z.lazy(() => BookLoanUncheckedCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  transcripts: z.lazy(() => TranscriptUncheckedCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  attendances: z.lazy(() => AttendanceUncheckedCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  scholarshipApplications: z.lazy(() => ScholarshipApplicationUncheckedCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  certificates: z.lazy(() => CertificateUncheckedCreateNestedManyWithoutStudentInputObjectSchema).optional()
}).strict();
