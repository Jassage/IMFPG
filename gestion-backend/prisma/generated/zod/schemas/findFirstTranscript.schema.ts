import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { TranscriptIncludeObjectSchema } from './objects/TranscriptInclude.schema';
import { TranscriptOrderByWithRelationInputObjectSchema } from './objects/TranscriptOrderByWithRelationInput.schema';
import { TranscriptWhereInputObjectSchema } from './objects/TranscriptWhereInput.schema';
import { TranscriptWhereUniqueInputObjectSchema } from './objects/TranscriptWhereUniqueInput.schema';
import { TranscriptScalarFieldEnumSchema } from './enums/TranscriptScalarFieldEnum.schema';
import { StudentArgsObjectSchema } from './objects/StudentArgs.schema';
import { GradeArgsObjectSchema } from './objects/GradeArgs.schema';
import { TranscriptCountOutputTypeArgsObjectSchema } from './objects/TranscriptCountOutputTypeArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const TranscriptFindFirstSelectSchema: z.ZodType<Prisma.TranscriptSelect, z.ZodTypeDef, Prisma.TranscriptSelect> = z.object({
    id: z.boolean().optional(),
    student: z.boolean().optional(),
    studentId: z.boolean().optional(),
    semester: z.boolean().optional(),
    academicYear: z.boolean().optional(),
    gpa: z.boolean().optional(),
    totalCredits: z.boolean().optional(),
    creditsEarned: z.boolean().optional(),
    generatedDate: z.boolean().optional(),
    grades: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const TranscriptFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    student: z.boolean().optional(),
    studentId: z.boolean().optional(),
    semester: z.boolean().optional(),
    academicYear: z.boolean().optional(),
    gpa: z.boolean().optional(),
    totalCredits: z.boolean().optional(),
    creditsEarned: z.boolean().optional(),
    generatedDate: z.boolean().optional(),
    grades: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const TranscriptFindFirstSchema: z.ZodType<Prisma.TranscriptFindFirstArgs, z.ZodTypeDef, Prisma.TranscriptFindFirstArgs> = z.object({ select: TranscriptFindFirstSelectSchema.optional(), include: z.lazy(() => TranscriptIncludeObjectSchema.optional()), orderBy: z.union([TranscriptOrderByWithRelationInputObjectSchema, TranscriptOrderByWithRelationInputObjectSchema.array()]).optional(), where: TranscriptWhereInputObjectSchema.optional(), cursor: TranscriptWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TranscriptScalarFieldEnumSchema, TranscriptScalarFieldEnumSchema.array()]).optional() }).strict();

export const TranscriptFindFirstZodSchema = z.object({ select: TranscriptFindFirstSelectSchema.optional(), include: z.lazy(() => TranscriptIncludeObjectSchema.optional()), orderBy: z.union([TranscriptOrderByWithRelationInputObjectSchema, TranscriptOrderByWithRelationInputObjectSchema.array()]).optional(), where: TranscriptWhereInputObjectSchema.optional(), cursor: TranscriptWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TranscriptScalarFieldEnumSchema, TranscriptScalarFieldEnumSchema.array()]).optional() }).strict();