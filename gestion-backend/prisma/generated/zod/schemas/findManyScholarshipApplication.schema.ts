import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { ScholarshipApplicationIncludeObjectSchema } from './objects/ScholarshipApplicationInclude.schema';
import { ScholarshipApplicationOrderByWithRelationInputObjectSchema } from './objects/ScholarshipApplicationOrderByWithRelationInput.schema';
import { ScholarshipApplicationWhereInputObjectSchema } from './objects/ScholarshipApplicationWhereInput.schema';
import { ScholarshipApplicationWhereUniqueInputObjectSchema } from './objects/ScholarshipApplicationWhereUniqueInput.schema';
import { ScholarshipApplicationScalarFieldEnumSchema } from './enums/ScholarshipApplicationScalarFieldEnum.schema';
import { ScholarshipArgsObjectSchema } from './objects/ScholarshipArgs.schema';
import { StudentArgsObjectSchema } from './objects/StudentArgs.schema';
import { ScholarshipDocumentArgsObjectSchema } from './objects/ScholarshipDocumentArgs.schema';
import { ScholarshipApplicationCountOutputTypeArgsObjectSchema } from './objects/ScholarshipApplicationCountOutputTypeArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ScholarshipApplicationFindManySelectSchema: z.ZodType<Prisma.ScholarshipApplicationSelect, z.ZodTypeDef, Prisma.ScholarshipApplicationSelect> = z.object({
    id: z.boolean().optional(),
    scholarship: z.boolean().optional(),
    scholarshipId: z.boolean().optional(),
    student: z.boolean().optional(),
    studentId: z.boolean().optional(),
    applicationDate: z.boolean().optional(),
    documents: z.boolean().optional(),
    motivation: z.boolean().optional(),
    status: z.boolean().optional(),
    reviewNotes: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const ScholarshipApplicationFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    scholarship: z.boolean().optional(),
    scholarshipId: z.boolean().optional(),
    student: z.boolean().optional(),
    studentId: z.boolean().optional(),
    applicationDate: z.boolean().optional(),
    documents: z.boolean().optional(),
    motivation: z.boolean().optional(),
    status: z.boolean().optional(),
    reviewNotes: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const ScholarshipApplicationFindManySchema: z.ZodType<Prisma.ScholarshipApplicationFindManyArgs, z.ZodTypeDef, Prisma.ScholarshipApplicationFindManyArgs> = z.object({ select: ScholarshipApplicationFindManySelectSchema.optional(), include: z.lazy(() => ScholarshipApplicationIncludeObjectSchema.optional()), orderBy: z.union([ScholarshipApplicationOrderByWithRelationInputObjectSchema, ScholarshipApplicationOrderByWithRelationInputObjectSchema.array()]).optional(), where: ScholarshipApplicationWhereInputObjectSchema.optional(), cursor: ScholarshipApplicationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ScholarshipApplicationScalarFieldEnumSchema, ScholarshipApplicationScalarFieldEnumSchema.array()]).optional() }).strict();

export const ScholarshipApplicationFindManyZodSchema = z.object({ select: ScholarshipApplicationFindManySelectSchema.optional(), include: z.lazy(() => ScholarshipApplicationIncludeObjectSchema.optional()), orderBy: z.union([ScholarshipApplicationOrderByWithRelationInputObjectSchema, ScholarshipApplicationOrderByWithRelationInputObjectSchema.array()]).optional(), where: ScholarshipApplicationWhereInputObjectSchema.optional(), cursor: ScholarshipApplicationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ScholarshipApplicationScalarFieldEnumSchema, ScholarshipApplicationScalarFieldEnumSchema.array()]).optional() }).strict();