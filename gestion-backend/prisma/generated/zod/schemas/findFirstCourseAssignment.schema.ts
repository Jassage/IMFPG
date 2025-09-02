import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { CourseAssignmentIncludeObjectSchema } from './objects/CourseAssignmentInclude.schema';
import { CourseAssignmentOrderByWithRelationInputObjectSchema } from './objects/CourseAssignmentOrderByWithRelationInput.schema';
import { CourseAssignmentWhereInputObjectSchema } from './objects/CourseAssignmentWhereInput.schema';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './objects/CourseAssignmentWhereUniqueInput.schema';
import { CourseAssignmentScalarFieldEnumSchema } from './enums/CourseAssignmentScalarFieldEnum.schema';
import { UEArgsObjectSchema } from './objects/UEArgs.schema';
import { FacultyArgsObjectSchema } from './objects/FacultyArgs.schema';
import { ProfesseurArgsObjectSchema } from './objects/ProfesseurArgs.schema';
import { AcademicYearArgsObjectSchema } from './objects/AcademicYearArgs.schema';
import { FacultyLevelArgsObjectSchema } from './objects/FacultyLevelArgs.schema';
import { ScheduleArgsObjectSchema } from './objects/ScheduleArgs.schema';
import { CourseAssignmentCountOutputTypeArgsObjectSchema } from './objects/CourseAssignmentCountOutputTypeArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const CourseAssignmentFindFirstSelectSchema: z.ZodType<Prisma.CourseAssignmentSelect, z.ZodTypeDef, Prisma.CourseAssignmentSelect> = z.object({
    id: z.boolean().optional(),
    ue: z.boolean().optional(),
    ueId: z.boolean().optional(),
    faculty: z.boolean().optional(),
    facultyId: z.boolean().optional(),
    professeur: z.boolean().optional(),
    professeurId: z.boolean().optional(),
    academicYearId: z.boolean().optional(),
    academicYear: z.boolean().optional(),
    semester: z.boolean().optional(),
    level: z.boolean().optional(),
    facultyLevel: z.boolean().optional(),
    facultyLevelId: z.boolean().optional(),
    schedules: z.boolean().optional(),
    status: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const CourseAssignmentFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    ue: z.boolean().optional(),
    ueId: z.boolean().optional(),
    faculty: z.boolean().optional(),
    facultyId: z.boolean().optional(),
    professeur: z.boolean().optional(),
    professeurId: z.boolean().optional(),
    academicYearId: z.boolean().optional(),
    academicYear: z.boolean().optional(),
    semester: z.boolean().optional(),
    level: z.boolean().optional(),
    facultyLevel: z.boolean().optional(),
    facultyLevelId: z.boolean().optional(),
    schedules: z.boolean().optional(),
    status: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const CourseAssignmentFindFirstSchema: z.ZodType<Prisma.CourseAssignmentFindFirstArgs, z.ZodTypeDef, Prisma.CourseAssignmentFindFirstArgs> = z.object({ select: CourseAssignmentFindFirstSelectSchema.optional(), include: z.lazy(() => CourseAssignmentIncludeObjectSchema.optional()), orderBy: z.union([CourseAssignmentOrderByWithRelationInputObjectSchema, CourseAssignmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: CourseAssignmentWhereInputObjectSchema.optional(), cursor: CourseAssignmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CourseAssignmentScalarFieldEnumSchema, CourseAssignmentScalarFieldEnumSchema.array()]).optional() }).strict();

export const CourseAssignmentFindFirstZodSchema = z.object({ select: CourseAssignmentFindFirstSelectSchema.optional(), include: z.lazy(() => CourseAssignmentIncludeObjectSchema.optional()), orderBy: z.union([CourseAssignmentOrderByWithRelationInputObjectSchema, CourseAssignmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: CourseAssignmentWhereInputObjectSchema.optional(), cursor: CourseAssignmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CourseAssignmentScalarFieldEnumSchema, CourseAssignmentScalarFieldEnumSchema.array()]).optional() }).strict();