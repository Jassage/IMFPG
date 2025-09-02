import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { StudentIncludeObjectSchema } from './objects/StudentInclude.schema';
import { StudentOrderByWithRelationInputObjectSchema } from './objects/StudentOrderByWithRelationInput.schema';
import { StudentWhereInputObjectSchema } from './objects/StudentWhereInput.schema';
import { StudentWhereUniqueInputObjectSchema } from './objects/StudentWhereUniqueInput.schema';
import { StudentScalarFieldEnumSchema } from './enums/StudentScalarFieldEnum.schema';
import { UserArgsObjectSchema } from './objects/UserArgs.schema';
import { EnrollmentArgsObjectSchema } from './objects/EnrollmentArgs.schema';
import { GuardianArgsObjectSchema } from './objects/GuardianArgs.schema';
import { GradeArgsObjectSchema } from './objects/GradeArgs.schema';
import { RetakeArgsObjectSchema } from './objects/RetakeArgs.schema';
import { PaymentArgsObjectSchema } from './objects/PaymentArgs.schema';
import { BookLoanArgsObjectSchema } from './objects/BookLoanArgs.schema';
import { TranscriptArgsObjectSchema } from './objects/TranscriptArgs.schema';
import { AttendanceArgsObjectSchema } from './objects/AttendanceArgs.schema';
import { ScholarshipApplicationArgsObjectSchema } from './objects/ScholarshipApplicationArgs.schema';
import { CertificateArgsObjectSchema } from './objects/CertificateArgs.schema';
import { StudentCountOutputTypeArgsObjectSchema } from './objects/StudentCountOutputTypeArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const StudentFindManySelectSchema: z.ZodType<Prisma.StudentSelect, z.ZodTypeDef, Prisma.StudentSelect> = z.object({
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
    user: z.boolean().optional(),
    userId: z.boolean().optional(),
    enrollments: z.boolean().optional(),
    guardians: z.boolean().optional(),
    grades: z.boolean().optional(),
    retakes: z.boolean().optional(),
    payments: z.boolean().optional(),
    bookLoans: z.boolean().optional(),
    transcripts: z.boolean().optional(),
    attendances: z.boolean().optional(),
    scholarshipApplications: z.boolean().optional(),
    certificates: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const StudentFindManySelectZodSchema = z.object({
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
    user: z.boolean().optional(),
    userId: z.boolean().optional(),
    enrollments: z.boolean().optional(),
    guardians: z.boolean().optional(),
    grades: z.boolean().optional(),
    retakes: z.boolean().optional(),
    payments: z.boolean().optional(),
    bookLoans: z.boolean().optional(),
    transcripts: z.boolean().optional(),
    attendances: z.boolean().optional(),
    scholarshipApplications: z.boolean().optional(),
    certificates: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const StudentFindManySchema: z.ZodType<Prisma.StudentFindManyArgs, z.ZodTypeDef, Prisma.StudentFindManyArgs> = z.object({ select: StudentFindManySelectSchema.optional(), include: z.lazy(() => StudentIncludeObjectSchema.optional()), orderBy: z.union([StudentOrderByWithRelationInputObjectSchema, StudentOrderByWithRelationInputObjectSchema.array()]).optional(), where: StudentWhereInputObjectSchema.optional(), cursor: StudentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([StudentScalarFieldEnumSchema, StudentScalarFieldEnumSchema.array()]).optional() }).strict();

export const StudentFindManyZodSchema = z.object({ select: StudentFindManySelectSchema.optional(), include: z.lazy(() => StudentIncludeObjectSchema.optional()), orderBy: z.union([StudentOrderByWithRelationInputObjectSchema, StudentOrderByWithRelationInputObjectSchema.array()]).optional(), where: StudentWhereInputObjectSchema.optional(), cursor: StudentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([StudentScalarFieldEnumSchema, StudentScalarFieldEnumSchema.array()]).optional() }).strict();