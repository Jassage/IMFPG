import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { AcademicYearIncludeObjectSchema } from './objects/AcademicYearInclude.schema';
import { AcademicYearOrderByWithRelationInputObjectSchema } from './objects/AcademicYearOrderByWithRelationInput.schema';
import { AcademicYearWhereInputObjectSchema } from './objects/AcademicYearWhereInput.schema';
import { AcademicYearWhereUniqueInputObjectSchema } from './objects/AcademicYearWhereUniqueInput.schema';
import { AcademicYearScalarFieldEnumSchema } from './enums/AcademicYearScalarFieldEnum.schema';
import { GradeArgsObjectSchema } from './objects/GradeArgs.schema';
import { EnrollmentArgsObjectSchema } from './objects/EnrollmentArgs.schema';
import { CourseAssignmentArgsObjectSchema } from './objects/CourseAssignmentArgs.schema';
import { PaymentArgsObjectSchema } from './objects/PaymentArgs.schema';
import { ScholarshipArgsObjectSchema } from './objects/ScholarshipArgs.schema';
import { AcademicYearCountOutputTypeArgsObjectSchema } from './objects/AcademicYearCountOutputTypeArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const AcademicYearFindFirstOrThrowSelectSchema: z.ZodType<Prisma.AcademicYearSelect, z.ZodTypeDef, Prisma.AcademicYearSelect> = z.object({
    id: z.boolean().optional(),
    year: z.boolean().optional(),
    startDate: z.boolean().optional(),
    endDate: z.boolean().optional(),
    isCurrent: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    grades: z.boolean().optional(),
    enrollments: z.boolean().optional(),
    assignments: z.boolean().optional(),
    payments: z.boolean().optional(),
    scholarship: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const AcademicYearFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    year: z.boolean().optional(),
    startDate: z.boolean().optional(),
    endDate: z.boolean().optional(),
    isCurrent: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    grades: z.boolean().optional(),
    enrollments: z.boolean().optional(),
    assignments: z.boolean().optional(),
    payments: z.boolean().optional(),
    scholarship: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const AcademicYearFindFirstOrThrowSchema: z.ZodType<Prisma.AcademicYearFindFirstOrThrowArgs, z.ZodTypeDef, Prisma.AcademicYearFindFirstOrThrowArgs> = z.object({ select: AcademicYearFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => AcademicYearIncludeObjectSchema.optional()), orderBy: z.union([AcademicYearOrderByWithRelationInputObjectSchema, AcademicYearOrderByWithRelationInputObjectSchema.array()]).optional(), where: AcademicYearWhereInputObjectSchema.optional(), cursor: AcademicYearWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AcademicYearScalarFieldEnumSchema, AcademicYearScalarFieldEnumSchema.array()]).optional() }).strict();

export const AcademicYearFindFirstOrThrowZodSchema = z.object({ select: AcademicYearFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => AcademicYearIncludeObjectSchema.optional()), orderBy: z.union([AcademicYearOrderByWithRelationInputObjectSchema, AcademicYearOrderByWithRelationInputObjectSchema.array()]).optional(), where: AcademicYearWhereInputObjectSchema.optional(), cursor: AcademicYearWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AcademicYearScalarFieldEnumSchema, AcademicYearScalarFieldEnumSchema.array()]).optional() }).strict();