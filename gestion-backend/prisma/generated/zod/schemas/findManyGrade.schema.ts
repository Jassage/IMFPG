import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { GradeIncludeObjectSchema } from './objects/GradeInclude.schema';
import { GradeOrderByWithRelationInputObjectSchema } from './objects/GradeOrderByWithRelationInput.schema';
import { GradeWhereInputObjectSchema } from './objects/GradeWhereInput.schema';
import { GradeWhereUniqueInputObjectSchema } from './objects/GradeWhereUniqueInput.schema';
import { GradeScalarFieldEnumSchema } from './enums/GradeScalarFieldEnum.schema';
import { StudentArgsObjectSchema } from './objects/StudentArgs.schema';
import { UEArgsObjectSchema } from './objects/UEArgs.schema';
import { AcademicYearArgsObjectSchema } from './objects/AcademicYearArgs.schema';
import { TranscriptArgsObjectSchema } from './objects/TranscriptArgs.schema';
import { ProfesseurArgsObjectSchema } from './objects/ProfesseurArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const GradeFindManySelectSchema: z.ZodType<Prisma.GradeSelect, z.ZodTypeDef, Prisma.GradeSelect> = z.object({
    id: z.boolean().optional(),
    student: z.boolean().optional(),
    studentId: z.boolean().optional(),
    ue: z.boolean().optional(),
    ueId: z.boolean().optional(),
    grade: z.boolean().optional(),
    status: z.boolean().optional(),
    session: z.boolean().optional(),
    semester: z.boolean().optional(),
    level: z.boolean().optional(),
    academicYearId: z.boolean().optional(),
    academicYear: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    transcript: z.boolean().optional(),
    transcriptId: z.boolean().optional(),
    professeur: z.boolean().optional(),
    professeurId: z.boolean().optional()
  }).strict();

export const GradeFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    student: z.boolean().optional(),
    studentId: z.boolean().optional(),
    ue: z.boolean().optional(),
    ueId: z.boolean().optional(),
    grade: z.boolean().optional(),
    status: z.boolean().optional(),
    session: z.boolean().optional(),
    semester: z.boolean().optional(),
    level: z.boolean().optional(),
    academicYearId: z.boolean().optional(),
    academicYear: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    transcript: z.boolean().optional(),
    transcriptId: z.boolean().optional(),
    professeur: z.boolean().optional(),
    professeurId: z.boolean().optional()
  }).strict();

export const GradeFindManySchema: z.ZodType<Prisma.GradeFindManyArgs, z.ZodTypeDef, Prisma.GradeFindManyArgs> = z.object({ select: GradeFindManySelectSchema.optional(), include: z.lazy(() => GradeIncludeObjectSchema.optional()), orderBy: z.union([GradeOrderByWithRelationInputObjectSchema, GradeOrderByWithRelationInputObjectSchema.array()]).optional(), where: GradeWhereInputObjectSchema.optional(), cursor: GradeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([GradeScalarFieldEnumSchema, GradeScalarFieldEnumSchema.array()]).optional() }).strict();

export const GradeFindManyZodSchema = z.object({ select: GradeFindManySelectSchema.optional(), include: z.lazy(() => GradeIncludeObjectSchema.optional()), orderBy: z.union([GradeOrderByWithRelationInputObjectSchema, GradeOrderByWithRelationInputObjectSchema.array()]).optional(), where: GradeWhereInputObjectSchema.optional(), cursor: GradeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([GradeScalarFieldEnumSchema, GradeScalarFieldEnumSchema.array()]).optional() }).strict();