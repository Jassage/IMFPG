import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { FacultyIncludeObjectSchema } from './objects/FacultyInclude.schema';
import { FacultyOrderByWithRelationInputObjectSchema } from './objects/FacultyOrderByWithRelationInput.schema';
import { FacultyWhereInputObjectSchema } from './objects/FacultyWhereInput.schema';
import { FacultyWhereUniqueInputObjectSchema } from './objects/FacultyWhereUniqueInput.schema';
import { FacultyScalarFieldEnumSchema } from './enums/FacultyScalarFieldEnum.schema';
import { FacultyLevelArgsObjectSchema } from './objects/FacultyLevelArgs.schema';
import { CourseAssignmentArgsObjectSchema } from './objects/CourseAssignmentArgs.schema';
import { EnrollmentArgsObjectSchema } from './objects/EnrollmentArgs.schema';
import { FacultyCountOutputTypeArgsObjectSchema } from './objects/FacultyCountOutputTypeArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const FacultyFindFirstOrThrowSelectSchema: z.ZodType<Prisma.FacultySelect, z.ZodTypeDef, Prisma.FacultySelect> = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    code: z.boolean().optional(),
    description: z.boolean().optional(),
    dean: z.boolean().optional(),
    studentsCount: z.boolean().optional(),
    coursesCount: z.boolean().optional(),
    studyDuration: z.boolean().optional(),
    levels: z.boolean().optional(),
    status: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    assignments: z.boolean().optional(),
    enrollments: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const FacultyFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    code: z.boolean().optional(),
    description: z.boolean().optional(),
    dean: z.boolean().optional(),
    studentsCount: z.boolean().optional(),
    coursesCount: z.boolean().optional(),
    studyDuration: z.boolean().optional(),
    levels: z.boolean().optional(),
    status: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    assignments: z.boolean().optional(),
    enrollments: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const FacultyFindFirstOrThrowSchema: z.ZodType<Prisma.FacultyFindFirstOrThrowArgs, z.ZodTypeDef, Prisma.FacultyFindFirstOrThrowArgs> = z.object({ select: FacultyFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => FacultyIncludeObjectSchema.optional()), orderBy: z.union([FacultyOrderByWithRelationInputObjectSchema, FacultyOrderByWithRelationInputObjectSchema.array()]).optional(), where: FacultyWhereInputObjectSchema.optional(), cursor: FacultyWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([FacultyScalarFieldEnumSchema, FacultyScalarFieldEnumSchema.array()]).optional() }).strict();

export const FacultyFindFirstOrThrowZodSchema = z.object({ select: FacultyFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => FacultyIncludeObjectSchema.optional()), orderBy: z.union([FacultyOrderByWithRelationInputObjectSchema, FacultyOrderByWithRelationInputObjectSchema.array()]).optional(), where: FacultyWhereInputObjectSchema.optional(), cursor: FacultyWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([FacultyScalarFieldEnumSchema, FacultyScalarFieldEnumSchema.array()]).optional() }).strict();