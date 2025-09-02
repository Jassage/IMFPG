import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { ScheduleIncludeObjectSchema } from './objects/ScheduleInclude.schema';
import { ScheduleOrderByWithRelationInputObjectSchema } from './objects/ScheduleOrderByWithRelationInput.schema';
import { ScheduleWhereInputObjectSchema } from './objects/ScheduleWhereInput.schema';
import { ScheduleWhereUniqueInputObjectSchema } from './objects/ScheduleWhereUniqueInput.schema';
import { ScheduleScalarFieldEnumSchema } from './enums/ScheduleScalarFieldEnum.schema';
import { CourseAssignmentArgsObjectSchema } from './objects/CourseAssignmentArgs.schema';
import { ProfesseurArgsObjectSchema } from './objects/ProfesseurArgs.schema';
import { AttendanceArgsObjectSchema } from './objects/AttendanceArgs.schema';
import { ScheduleCountOutputTypeArgsObjectSchema } from './objects/ScheduleCountOutputTypeArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ScheduleFindFirstOrThrowSelectSchema: z.ZodType<Prisma.ScheduleSelect, z.ZodTypeDef, Prisma.ScheduleSelect> = z.object({
    id: z.boolean().optional(),
    assignment: z.boolean().optional(),
    assignmentId: z.boolean().optional(),
    dayOfWeek: z.boolean().optional(),
    startTime: z.boolean().optional(),
    endTime: z.boolean().optional(),
    classroom: z.boolean().optional(),
    recurrence: z.boolean().optional(),
    exceptions: z.boolean().optional(),
    professeur: z.boolean().optional(),
    professeurId: z.boolean().optional(),
    attendances: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const ScheduleFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    assignment: z.boolean().optional(),
    assignmentId: z.boolean().optional(),
    dayOfWeek: z.boolean().optional(),
    startTime: z.boolean().optional(),
    endTime: z.boolean().optional(),
    classroom: z.boolean().optional(),
    recurrence: z.boolean().optional(),
    exceptions: z.boolean().optional(),
    professeur: z.boolean().optional(),
    professeurId: z.boolean().optional(),
    attendances: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const ScheduleFindFirstOrThrowSchema: z.ZodType<Prisma.ScheduleFindFirstOrThrowArgs, z.ZodTypeDef, Prisma.ScheduleFindFirstOrThrowArgs> = z.object({ select: ScheduleFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => ScheduleIncludeObjectSchema.optional()), orderBy: z.union([ScheduleOrderByWithRelationInputObjectSchema, ScheduleOrderByWithRelationInputObjectSchema.array()]).optional(), where: ScheduleWhereInputObjectSchema.optional(), cursor: ScheduleWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ScheduleScalarFieldEnumSchema, ScheduleScalarFieldEnumSchema.array()]).optional() }).strict();

export const ScheduleFindFirstOrThrowZodSchema = z.object({ select: ScheduleFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => ScheduleIncludeObjectSchema.optional()), orderBy: z.union([ScheduleOrderByWithRelationInputObjectSchema, ScheduleOrderByWithRelationInputObjectSchema.array()]).optional(), where: ScheduleWhereInputObjectSchema.optional(), cursor: ScheduleWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ScheduleScalarFieldEnumSchema, ScheduleScalarFieldEnumSchema.array()]).optional() }).strict();