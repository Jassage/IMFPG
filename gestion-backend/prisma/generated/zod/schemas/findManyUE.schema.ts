import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { UEIncludeObjectSchema } from './objects/UEInclude.schema';
import { UEOrderByWithRelationInputObjectSchema } from './objects/UEOrderByWithRelationInput.schema';
import { UEWhereInputObjectSchema } from './objects/UEWhereInput.schema';
import { UEWhereUniqueInputObjectSchema } from './objects/UEWhereUniqueInput.schema';
import { UEScalarFieldEnumSchema } from './enums/UEScalarFieldEnum.schema';
import { UserArgsObjectSchema } from './objects/UserArgs.schema';
import { UEPrerequisiteArgsObjectSchema } from './objects/UEPrerequisiteArgs.schema';
import { CourseAssignmentArgsObjectSchema } from './objects/CourseAssignmentArgs.schema';
import { GradeArgsObjectSchema } from './objects/GradeArgs.schema';
import { RetakeArgsObjectSchema } from './objects/RetakeArgs.schema';
import { UECountOutputTypeArgsObjectSchema } from './objects/UECountOutputTypeArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const UEFindManySelectSchema: z.ZodType<Prisma.UESelect, z.ZodTypeDef, Prisma.UESelect> = z.object({
    id: z.boolean().optional(),
    code: z.boolean().optional(),
    title: z.boolean().optional(),
    credits: z.boolean().optional(),
    type: z.boolean().optional(),
    passingGrade: z.boolean().optional(),
    description: z.boolean().optional(),
    objectives: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    createdBy: z.boolean().optional(),
    createdById: z.boolean().optional(),
    prerequisites: z.boolean().optional(),
    requiredFor: z.boolean().optional(),
    assignments: z.boolean().optional(),
    grades: z.boolean().optional(),
    retakes: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const UEFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    code: z.boolean().optional(),
    title: z.boolean().optional(),
    credits: z.boolean().optional(),
    type: z.boolean().optional(),
    passingGrade: z.boolean().optional(),
    description: z.boolean().optional(),
    objectives: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    createdBy: z.boolean().optional(),
    createdById: z.boolean().optional(),
    prerequisites: z.boolean().optional(),
    requiredFor: z.boolean().optional(),
    assignments: z.boolean().optional(),
    grades: z.boolean().optional(),
    retakes: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const UEFindManySchema: z.ZodType<Prisma.UEFindManyArgs, z.ZodTypeDef, Prisma.UEFindManyArgs> = z.object({ select: UEFindManySelectSchema.optional(), include: z.lazy(() => UEIncludeObjectSchema.optional()), orderBy: z.union([UEOrderByWithRelationInputObjectSchema, UEOrderByWithRelationInputObjectSchema.array()]).optional(), where: UEWhereInputObjectSchema.optional(), cursor: UEWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([UEScalarFieldEnumSchema, UEScalarFieldEnumSchema.array()]).optional() }).strict();

export const UEFindManyZodSchema = z.object({ select: UEFindManySelectSchema.optional(), include: z.lazy(() => UEIncludeObjectSchema.optional()), orderBy: z.union([UEOrderByWithRelationInputObjectSchema, UEOrderByWithRelationInputObjectSchema.array()]).optional(), where: UEWhereInputObjectSchema.optional(), cursor: UEWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([UEScalarFieldEnumSchema, UEScalarFieldEnumSchema.array()]).optional() }).strict();