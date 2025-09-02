import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { EnrollmentIncludeObjectSchema } from './objects/EnrollmentInclude.schema';
import { EnrollmentOrderByWithRelationInputObjectSchema } from './objects/EnrollmentOrderByWithRelationInput.schema';
import { EnrollmentWhereInputObjectSchema } from './objects/EnrollmentWhereInput.schema';
import { EnrollmentWhereUniqueInputObjectSchema } from './objects/EnrollmentWhereUniqueInput.schema';
import { EnrollmentScalarFieldEnumSchema } from './enums/EnrollmentScalarFieldEnum.schema';
import { StudentArgsObjectSchema } from './objects/StudentArgs.schema';
import { FacultyArgsObjectSchema } from './objects/FacultyArgs.schema';
import { AcademicYearArgsObjectSchema } from './objects/AcademicYearArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const EnrollmentFindManySelectSchema: z.ZodType<Prisma.EnrollmentSelect, z.ZodTypeDef, Prisma.EnrollmentSelect> = z.object({
    id: z.boolean().optional(),
    student: z.boolean().optional(),
    studentId: z.boolean().optional(),
    faculty: z.boolean().optional(),
    facultyId: z.boolean().optional(),
    level: z.boolean().optional(),
    academicYearId: z.boolean().optional(),
    academicYear: z.boolean().optional(),
    enrollmentDate: z.boolean().optional(),
    status: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const EnrollmentFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    student: z.boolean().optional(),
    studentId: z.boolean().optional(),
    faculty: z.boolean().optional(),
    facultyId: z.boolean().optional(),
    level: z.boolean().optional(),
    academicYearId: z.boolean().optional(),
    academicYear: z.boolean().optional(),
    enrollmentDate: z.boolean().optional(),
    status: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const EnrollmentFindManySchema: z.ZodType<Prisma.EnrollmentFindManyArgs, z.ZodTypeDef, Prisma.EnrollmentFindManyArgs> = z.object({ select: EnrollmentFindManySelectSchema.optional(), include: z.lazy(() => EnrollmentIncludeObjectSchema.optional()), orderBy: z.union([EnrollmentOrderByWithRelationInputObjectSchema, EnrollmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: EnrollmentWhereInputObjectSchema.optional(), cursor: EnrollmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([EnrollmentScalarFieldEnumSchema, EnrollmentScalarFieldEnumSchema.array()]).optional() }).strict();

export const EnrollmentFindManyZodSchema = z.object({ select: EnrollmentFindManySelectSchema.optional(), include: z.lazy(() => EnrollmentIncludeObjectSchema.optional()), orderBy: z.union([EnrollmentOrderByWithRelationInputObjectSchema, EnrollmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: EnrollmentWhereInputObjectSchema.optional(), cursor: EnrollmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([EnrollmentScalarFieldEnumSchema, EnrollmentScalarFieldEnumSchema.array()]).optional() }).strict();