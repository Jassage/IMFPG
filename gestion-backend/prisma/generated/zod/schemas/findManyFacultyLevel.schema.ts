import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { FacultyLevelIncludeObjectSchema } from './objects/FacultyLevelInclude.schema';
import { FacultyLevelOrderByWithRelationInputObjectSchema } from './objects/FacultyLevelOrderByWithRelationInput.schema';
import { FacultyLevelWhereInputObjectSchema } from './objects/FacultyLevelWhereInput.schema';
import { FacultyLevelWhereUniqueInputObjectSchema } from './objects/FacultyLevelWhereUniqueInput.schema';
import { FacultyLevelScalarFieldEnumSchema } from './enums/FacultyLevelScalarFieldEnum.schema';
import { FacultyArgsObjectSchema } from './objects/FacultyArgs.schema';
import { CourseAssignmentArgsObjectSchema } from './objects/CourseAssignmentArgs.schema';
import { FacultyLevelCountOutputTypeArgsObjectSchema } from './objects/FacultyLevelCountOutputTypeArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const FacultyLevelFindManySelectSchema: z.ZodType<Prisma.FacultyLevelSelect, z.ZodTypeDef, Prisma.FacultyLevelSelect> = z.object({
    id: z.boolean().optional(),
    facultyId: z.boolean().optional(),
    faculty: z.boolean().optional(),
    level: z.boolean().optional(),
    assignments: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const FacultyLevelFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    facultyId: z.boolean().optional(),
    faculty: z.boolean().optional(),
    level: z.boolean().optional(),
    assignments: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const FacultyLevelFindManySchema: z.ZodType<Prisma.FacultyLevelFindManyArgs, z.ZodTypeDef, Prisma.FacultyLevelFindManyArgs> = z.object({ select: FacultyLevelFindManySelectSchema.optional(), include: z.lazy(() => FacultyLevelIncludeObjectSchema.optional()), orderBy: z.union([FacultyLevelOrderByWithRelationInputObjectSchema, FacultyLevelOrderByWithRelationInputObjectSchema.array()]).optional(), where: FacultyLevelWhereInputObjectSchema.optional(), cursor: FacultyLevelWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([FacultyLevelScalarFieldEnumSchema, FacultyLevelScalarFieldEnumSchema.array()]).optional() }).strict();

export const FacultyLevelFindManyZodSchema = z.object({ select: FacultyLevelFindManySelectSchema.optional(), include: z.lazy(() => FacultyLevelIncludeObjectSchema.optional()), orderBy: z.union([FacultyLevelOrderByWithRelationInputObjectSchema, FacultyLevelOrderByWithRelationInputObjectSchema.array()]).optional(), where: FacultyLevelWhereInputObjectSchema.optional(), cursor: FacultyLevelWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([FacultyLevelScalarFieldEnumSchema, FacultyLevelScalarFieldEnumSchema.array()]).optional() }).strict();