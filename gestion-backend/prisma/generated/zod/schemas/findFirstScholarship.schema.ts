import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { ScholarshipIncludeObjectSchema } from './objects/ScholarshipInclude.schema';
import { ScholarshipOrderByWithRelationInputObjectSchema } from './objects/ScholarshipOrderByWithRelationInput.schema';
import { ScholarshipWhereInputObjectSchema } from './objects/ScholarshipWhereInput.schema';
import { ScholarshipWhereUniqueInputObjectSchema } from './objects/ScholarshipWhereUniqueInput.schema';
import { ScholarshipScalarFieldEnumSchema } from './enums/ScholarshipScalarFieldEnum.schema';
import { AcademicYearArgsObjectSchema } from './objects/AcademicYearArgs.schema';
import { ScholarshipApplicationArgsObjectSchema } from './objects/ScholarshipApplicationArgs.schema';
import { ScholarshipCountOutputTypeArgsObjectSchema } from './objects/ScholarshipCountOutputTypeArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ScholarshipFindFirstSelectSchema: z.ZodType<Prisma.ScholarshipSelect, z.ZodTypeDef, Prisma.ScholarshipSelect> = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    description: z.boolean().optional(),
    amount: z.boolean().optional(),
    criteria: z.boolean().optional(),
    applicationDeadline: z.boolean().optional(),
    academicYearId: z.boolean().optional(),
    academicYear: z.boolean().optional(),
    maxRecipients: z.boolean().optional(),
    currentRecipients: z.boolean().optional(),
    status: z.boolean().optional(),
    applications: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const ScholarshipFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    description: z.boolean().optional(),
    amount: z.boolean().optional(),
    criteria: z.boolean().optional(),
    applicationDeadline: z.boolean().optional(),
    academicYearId: z.boolean().optional(),
    academicYear: z.boolean().optional(),
    maxRecipients: z.boolean().optional(),
    currentRecipients: z.boolean().optional(),
    status: z.boolean().optional(),
    applications: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const ScholarshipFindFirstSchema: z.ZodType<Prisma.ScholarshipFindFirstArgs, z.ZodTypeDef, Prisma.ScholarshipFindFirstArgs> = z.object({ select: ScholarshipFindFirstSelectSchema.optional(), include: z.lazy(() => ScholarshipIncludeObjectSchema.optional()), orderBy: z.union([ScholarshipOrderByWithRelationInputObjectSchema, ScholarshipOrderByWithRelationInputObjectSchema.array()]).optional(), where: ScholarshipWhereInputObjectSchema.optional(), cursor: ScholarshipWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ScholarshipScalarFieldEnumSchema, ScholarshipScalarFieldEnumSchema.array()]).optional() }).strict();

export const ScholarshipFindFirstZodSchema = z.object({ select: ScholarshipFindFirstSelectSchema.optional(), include: z.lazy(() => ScholarshipIncludeObjectSchema.optional()), orderBy: z.union([ScholarshipOrderByWithRelationInputObjectSchema, ScholarshipOrderByWithRelationInputObjectSchema.array()]).optional(), where: ScholarshipWhereInputObjectSchema.optional(), cursor: ScholarshipWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ScholarshipScalarFieldEnumSchema, ScholarshipScalarFieldEnumSchema.array()]).optional() }).strict();