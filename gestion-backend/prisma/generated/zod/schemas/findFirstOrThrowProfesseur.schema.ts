import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { ProfesseurIncludeObjectSchema } from './objects/ProfesseurInclude.schema';
import { ProfesseurOrderByWithRelationInputObjectSchema } from './objects/ProfesseurOrderByWithRelationInput.schema';
import { ProfesseurWhereInputObjectSchema } from './objects/ProfesseurWhereInput.schema';
import { ProfesseurWhereUniqueInputObjectSchema } from './objects/ProfesseurWhereUniqueInput.schema';
import { ProfesseurScalarFieldEnumSchema } from './enums/ProfesseurScalarFieldEnum.schema';
import { UserArgsObjectSchema } from './objects/UserArgs.schema';
import { CourseAssignmentArgsObjectSchema } from './objects/CourseAssignmentArgs.schema';
import { ScheduleArgsObjectSchema } from './objects/ScheduleArgs.schema';
import { GradeArgsObjectSchema } from './objects/GradeArgs.schema';
import { ProfesseurCountOutputTypeArgsObjectSchema } from './objects/ProfesseurCountOutputTypeArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ProfesseurFindFirstOrThrowSelectSchema: z.ZodType<Prisma.ProfesseurSelect, z.ZodTypeDef, Prisma.ProfesseurSelect> = z.object({
    id: z.boolean().optional(),
    firstName: z.boolean().optional(),
    lastName: z.boolean().optional(),
    email: z.boolean().optional(),
    phone: z.boolean().optional(),
    department: z.boolean().optional(),
    office: z.boolean().optional(),
    hireDate: z.boolean().optional(),
    status: z.boolean().optional(),
    speciality: z.boolean().optional(),
    user: z.boolean().optional(),
    userId: z.boolean().optional(),
    assignments: z.boolean().optional(),
    schedules: z.boolean().optional(),
    grades: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const ProfesseurFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    firstName: z.boolean().optional(),
    lastName: z.boolean().optional(),
    email: z.boolean().optional(),
    phone: z.boolean().optional(),
    department: z.boolean().optional(),
    office: z.boolean().optional(),
    hireDate: z.boolean().optional(),
    status: z.boolean().optional(),
    speciality: z.boolean().optional(),
    user: z.boolean().optional(),
    userId: z.boolean().optional(),
    assignments: z.boolean().optional(),
    schedules: z.boolean().optional(),
    grades: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const ProfesseurFindFirstOrThrowSchema: z.ZodType<Prisma.ProfesseurFindFirstOrThrowArgs, z.ZodTypeDef, Prisma.ProfesseurFindFirstOrThrowArgs> = z.object({ select: ProfesseurFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => ProfesseurIncludeObjectSchema.optional()), orderBy: z.union([ProfesseurOrderByWithRelationInputObjectSchema, ProfesseurOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProfesseurWhereInputObjectSchema.optional(), cursor: ProfesseurWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ProfesseurScalarFieldEnumSchema, ProfesseurScalarFieldEnumSchema.array()]).optional() }).strict();

export const ProfesseurFindFirstOrThrowZodSchema = z.object({ select: ProfesseurFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => ProfesseurIncludeObjectSchema.optional()), orderBy: z.union([ProfesseurOrderByWithRelationInputObjectSchema, ProfesseurOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProfesseurWhereInputObjectSchema.optional(), cursor: ProfesseurWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ProfesseurScalarFieldEnumSchema, ProfesseurScalarFieldEnumSchema.array()]).optional() }).strict();