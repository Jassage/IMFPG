import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { UserOrderByWithRelationInputObjectSchema } from './UserOrderByWithRelationInput.schema';
import { EnrollmentOrderByRelationAggregateInputObjectSchema } from './EnrollmentOrderByRelationAggregateInput.schema';
import { GuardianOrderByRelationAggregateInputObjectSchema } from './GuardianOrderByRelationAggregateInput.schema';
import { GradeOrderByRelationAggregateInputObjectSchema } from './GradeOrderByRelationAggregateInput.schema';
import { RetakeOrderByRelationAggregateInputObjectSchema } from './RetakeOrderByRelationAggregateInput.schema';
import { PaymentOrderByRelationAggregateInputObjectSchema } from './PaymentOrderByRelationAggregateInput.schema';
import { BookLoanOrderByRelationAggregateInputObjectSchema } from './BookLoanOrderByRelationAggregateInput.schema';
import { TranscriptOrderByRelationAggregateInputObjectSchema } from './TranscriptOrderByRelationAggregateInput.schema';
import { AttendanceOrderByRelationAggregateInputObjectSchema } from './AttendanceOrderByRelationAggregateInput.schema';
import { ScholarshipApplicationOrderByRelationAggregateInputObjectSchema } from './ScholarshipApplicationOrderByRelationAggregateInput.schema';
import { CertificateOrderByRelationAggregateInputObjectSchema } from './CertificateOrderByRelationAggregateInput.schema';
import { StudentOrderByRelevanceInputObjectSchema } from './StudentOrderByRelevanceInput.schema'

export const StudentOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.StudentOrderByWithRelationInput, z.ZodTypeDef, Prisma.StudentOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  firstName: SortOrderSchema.optional(),
  lastName: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  phone: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  dateOfBirth: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  placeOfBirth: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  address: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  photo: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  bloodGroup: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  allergies: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  disabilities: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  userId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  user: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentOrderByRelationAggregateInputObjectSchema).optional(),
  guardians: z.lazy(() => GuardianOrderByRelationAggregateInputObjectSchema).optional(),
  grades: z.lazy(() => GradeOrderByRelationAggregateInputObjectSchema).optional(),
  retakes: z.lazy(() => RetakeOrderByRelationAggregateInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentOrderByRelationAggregateInputObjectSchema).optional(),
  bookLoans: z.lazy(() => BookLoanOrderByRelationAggregateInputObjectSchema).optional(),
  transcripts: z.lazy(() => TranscriptOrderByRelationAggregateInputObjectSchema).optional(),
  attendances: z.lazy(() => AttendanceOrderByRelationAggregateInputObjectSchema).optional(),
  scholarshipApplications: z.lazy(() => ScholarshipApplicationOrderByRelationAggregateInputObjectSchema).optional(),
  certificates: z.lazy(() => CertificateOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => StudentOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const StudentOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  firstName: SortOrderSchema.optional(),
  lastName: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  phone: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  dateOfBirth: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  placeOfBirth: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  address: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  photo: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  bloodGroup: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  allergies: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  disabilities: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  userId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  user: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentOrderByRelationAggregateInputObjectSchema).optional(),
  guardians: z.lazy(() => GuardianOrderByRelationAggregateInputObjectSchema).optional(),
  grades: z.lazy(() => GradeOrderByRelationAggregateInputObjectSchema).optional(),
  retakes: z.lazy(() => RetakeOrderByRelationAggregateInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentOrderByRelationAggregateInputObjectSchema).optional(),
  bookLoans: z.lazy(() => BookLoanOrderByRelationAggregateInputObjectSchema).optional(),
  transcripts: z.lazy(() => TranscriptOrderByRelationAggregateInputObjectSchema).optional(),
  attendances: z.lazy(() => AttendanceOrderByRelationAggregateInputObjectSchema).optional(),
  scholarshipApplications: z.lazy(() => ScholarshipApplicationOrderByRelationAggregateInputObjectSchema).optional(),
  certificates: z.lazy(() => CertificateOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => StudentOrderByRelevanceInputObjectSchema).optional()
}).strict();
