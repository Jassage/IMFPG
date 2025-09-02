import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { StudentStatusSchema } from '../enums/StudentStatus.schema';
import { EnumStudentStatusFieldUpdateOperationsInputObjectSchema } from './EnumStudentStatusFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { EnrollmentUncheckedUpdateManyWithoutStudentNestedInputObjectSchema } from './EnrollmentUncheckedUpdateManyWithoutStudentNestedInput.schema';
import { GuardianUncheckedUpdateManyWithoutStudentNestedInputObjectSchema } from './GuardianUncheckedUpdateManyWithoutStudentNestedInput.schema';
import { GradeUncheckedUpdateManyWithoutStudentNestedInputObjectSchema } from './GradeUncheckedUpdateManyWithoutStudentNestedInput.schema';
import { RetakeUncheckedUpdateManyWithoutStudentNestedInputObjectSchema } from './RetakeUncheckedUpdateManyWithoutStudentNestedInput.schema';
import { PaymentUncheckedUpdateManyWithoutStudentNestedInputObjectSchema } from './PaymentUncheckedUpdateManyWithoutStudentNestedInput.schema';
import { BookLoanUncheckedUpdateManyWithoutStudentNestedInputObjectSchema } from './BookLoanUncheckedUpdateManyWithoutStudentNestedInput.schema';
import { TranscriptUncheckedUpdateManyWithoutStudentNestedInputObjectSchema } from './TranscriptUncheckedUpdateManyWithoutStudentNestedInput.schema';
import { ScholarshipApplicationUncheckedUpdateManyWithoutStudentNestedInputObjectSchema } from './ScholarshipApplicationUncheckedUpdateManyWithoutStudentNestedInput.schema';
import { CertificateUncheckedUpdateManyWithoutStudentNestedInputObjectSchema } from './CertificateUncheckedUpdateManyWithoutStudentNestedInput.schema'

export const StudentUncheckedUpdateWithoutAttendancesInputObjectSchema: z.ZodType<Prisma.StudentUncheckedUpdateWithoutAttendancesInput, z.ZodTypeDef, Prisma.StudentUncheckedUpdateWithoutAttendancesInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
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
  userId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  enrollments: z.lazy(() => EnrollmentUncheckedUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  guardians: z.lazy(() => GuardianUncheckedUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  grades: z.lazy(() => GradeUncheckedUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  retakes: z.lazy(() => RetakeUncheckedUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentUncheckedUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  bookLoans: z.lazy(() => BookLoanUncheckedUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  transcripts: z.lazy(() => TranscriptUncheckedUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  scholarshipApplications: z.lazy(() => ScholarshipApplicationUncheckedUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  certificates: z.lazy(() => CertificateUncheckedUpdateManyWithoutStudentNestedInputObjectSchema).optional()
}).strict();
export const StudentUncheckedUpdateWithoutAttendancesInputObjectZodSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
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
  userId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  enrollments: z.lazy(() => EnrollmentUncheckedUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  guardians: z.lazy(() => GuardianUncheckedUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  grades: z.lazy(() => GradeUncheckedUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  retakes: z.lazy(() => RetakeUncheckedUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentUncheckedUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  bookLoans: z.lazy(() => BookLoanUncheckedUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  transcripts: z.lazy(() => TranscriptUncheckedUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  scholarshipApplications: z.lazy(() => ScholarshipApplicationUncheckedUpdateManyWithoutStudentNestedInputObjectSchema).optional(),
  certificates: z.lazy(() => CertificateUncheckedUpdateManyWithoutStudentNestedInputObjectSchema).optional()
}).strict();
