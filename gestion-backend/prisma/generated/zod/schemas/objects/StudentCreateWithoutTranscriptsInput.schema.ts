import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentStatusSchema } from '../enums/StudentStatus.schema';
import { UserCreateNestedOneWithoutStudentInputObjectSchema } from './UserCreateNestedOneWithoutStudentInput.schema';
import { EnrollmentCreateNestedManyWithoutStudentInputObjectSchema } from './EnrollmentCreateNestedManyWithoutStudentInput.schema';
import { GuardianCreateNestedManyWithoutStudentInputObjectSchema } from './GuardianCreateNestedManyWithoutStudentInput.schema';
import { GradeCreateNestedManyWithoutStudentInputObjectSchema } from './GradeCreateNestedManyWithoutStudentInput.schema';
import { RetakeCreateNestedManyWithoutStudentInputObjectSchema } from './RetakeCreateNestedManyWithoutStudentInput.schema';
import { PaymentCreateNestedManyWithoutStudentInputObjectSchema } from './PaymentCreateNestedManyWithoutStudentInput.schema';
import { BookLoanCreateNestedManyWithoutStudentInputObjectSchema } from './BookLoanCreateNestedManyWithoutStudentInput.schema';
import { AttendanceCreateNestedManyWithoutStudentInputObjectSchema } from './AttendanceCreateNestedManyWithoutStudentInput.schema';
import { ScholarshipApplicationCreateNestedManyWithoutStudentInputObjectSchema } from './ScholarshipApplicationCreateNestedManyWithoutStudentInput.schema';
import { CertificateCreateNestedManyWithoutStudentInputObjectSchema } from './CertificateCreateNestedManyWithoutStudentInput.schema'

export const StudentCreateWithoutTranscriptsInputObjectSchema: z.ZodType<Prisma.StudentCreateWithoutTranscriptsInput, z.ZodTypeDef, Prisma.StudentCreateWithoutTranscriptsInput> = z.object({
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
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutStudentInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  guardians: z.lazy(() => GuardianCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  grades: z.lazy(() => GradeCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  retakes: z.lazy(() => RetakeCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  bookLoans: z.lazy(() => BookLoanCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  attendances: z.lazy(() => AttendanceCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  scholarshipApplications: z.lazy(() => ScholarshipApplicationCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  certificates: z.lazy(() => CertificateCreateNestedManyWithoutStudentInputObjectSchema).optional()
}).strict();
export const StudentCreateWithoutTranscriptsInputObjectZodSchema = z.object({
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
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutStudentInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  guardians: z.lazy(() => GuardianCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  grades: z.lazy(() => GradeCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  retakes: z.lazy(() => RetakeCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  bookLoans: z.lazy(() => BookLoanCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  attendances: z.lazy(() => AttendanceCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  scholarshipApplications: z.lazy(() => ScholarshipApplicationCreateNestedManyWithoutStudentInputObjectSchema).optional(),
  certificates: z.lazy(() => CertificateCreateNestedManyWithoutStudentInputObjectSchema).optional()
}).strict();
