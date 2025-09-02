import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { StudentStatusSchema } from '../enums/StudentStatus.schema';
import { EnumStudentStatusFieldUpdateOperationsInputObjectSchema } from './EnumStudentStatusFieldUpdateOperationsInput.schema';
import { UserUpdateOneWithoutStudentNestedInputObjectSchema } from './UserUpdateOneWithoutStudentNestedInput.schema';
import { EnrollmentUpdateManyWithoutStudentNestedInputObjectSchema } from './EnrollmentUpdateManyWithoutStudentNestedInput.schema';
import { GuardianUpdateManyWithoutStudentNestedInputObjectSchema } from './GuardianUpdateManyWithoutStudentNestedInput.schema';
import { GradeUpdateManyWithoutStudentNestedInputObjectSchema } from './GradeUpdateManyWithoutStudentNestedInput.schema';
import { RetakeUpdateManyWithoutStudentNestedInputObjectSchema } from './RetakeUpdateManyWithoutStudentNestedInput.schema';
import { PaymentUpdateManyWithoutStudentNestedInputObjectSchema } from './PaymentUpdateManyWithoutStudentNestedInput.schema';
import { BookLoanUpdateManyWithoutStudentNestedInputObjectSchema } from './BookLoanUpdateManyWithoutStudentNestedInput.schema';
import { TranscriptUpdateManyWithoutStudentNestedInputObjectSchema } from './TranscriptUpdateManyWithoutStudentNestedInput.schema';
import { AttendanceUpdateManyWithoutStudentNestedInputObjectSchema } from './AttendanceUpdateManyWithoutStudentNestedInput.schema';
import { ScholarshipApplicationUpdateManyWithoutStudentNestedInputObjectSchema } from './ScholarshipApplicationUpdateManyWithoutStudentNestedInput.schema'

export const StudentUpdateWithoutCertificatesInputObjectSchema: z.ZodType<Prisma.StudentUpdateWithoutCertificatesInput, z.ZodTypeDef, Prisma.StudentUpdateWithoutCertificatesInput> = z.object({
  firstName: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  lastName: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  studentId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  phone: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  dateOfBirth: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).nullish(),
  placeOfBirth: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  address: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  photo: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  bloodGroup: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  allergies: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  disabilities: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  status: z.union([StudentStatusSchema, z.lazy(() => EnumStudentStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  user: z.lazy(() => UserUpdateOneWithoutStudentNestedInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  guardians: z.lazy(() => GuardianUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  grades: z.lazy(() => GradeUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  retakes: z.lazy(() => RetakeUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  bookLoans: z.lazy(() => BookLoanUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  transcripts: z.lazy(() => TranscriptUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  attendances: z.lazy(() => AttendanceUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  scholarshipApplications: z.lazy(() => ScholarshipApplicationUpdateManyWithoutStudentNestedInputObjectSchema).optional()
}).strict();
export const StudentUpdateWithoutCertificatesInputObjectZodSchema = z.object({
  firstName: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  lastName: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  studentId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  phone: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  dateOfBirth: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).nullish(),
  placeOfBirth: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  address: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  photo: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  bloodGroup: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  allergies: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  disabilities: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  status: z.union([StudentStatusSchema, z.lazy(() => EnumStudentStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  user: z.lazy(() => UserUpdateOneWithoutStudentNestedInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  guardians: z.lazy(() => GuardianUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  grades: z.lazy(() => GradeUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  retakes: z.lazy(() => RetakeUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  bookLoans: z.lazy(() => BookLoanUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  transcripts: z.lazy(() => TranscriptUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  attendances: z.lazy(() => AttendanceUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  scholarshipApplications: z.lazy(() => ScholarshipApplicationUpdateManyWithoutStudentNestedInputObjectSchema).optional()
}).strict();
