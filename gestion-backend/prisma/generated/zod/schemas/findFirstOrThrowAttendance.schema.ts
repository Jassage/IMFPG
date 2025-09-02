import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { AttendanceIncludeObjectSchema } from './objects/AttendanceInclude.schema';
import { AttendanceOrderByWithRelationInputObjectSchema } from './objects/AttendanceOrderByWithRelationInput.schema';
import { AttendanceWhereInputObjectSchema } from './objects/AttendanceWhereInput.schema';
import { AttendanceWhereUniqueInputObjectSchema } from './objects/AttendanceWhereUniqueInput.schema';
import { AttendanceScalarFieldEnumSchema } from './enums/AttendanceScalarFieldEnum.schema';
import { StudentArgsObjectSchema } from './objects/StudentArgs.schema';
import { ScheduleArgsObjectSchema } from './objects/ScheduleArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const AttendanceFindFirstOrThrowSelectSchema: z.ZodType<Prisma.AttendanceSelect, z.ZodTypeDef, Prisma.AttendanceSelect> = z.object({
    id: z.boolean().optional(),
    student: z.boolean().optional(),
    studentId: z.boolean().optional(),
    schedule: z.boolean().optional(),
    scheduleId: z.boolean().optional(),
    date: z.boolean().optional(),
    status: z.boolean().optional(),
    notes: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const AttendanceFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    student: z.boolean().optional(),
    studentId: z.boolean().optional(),
    schedule: z.boolean().optional(),
    scheduleId: z.boolean().optional(),
    date: z.boolean().optional(),
    status: z.boolean().optional(),
    notes: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const AttendanceFindFirstOrThrowSchema: z.ZodType<Prisma.AttendanceFindFirstOrThrowArgs, z.ZodTypeDef, Prisma.AttendanceFindFirstOrThrowArgs> = z.object({ select: AttendanceFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => AttendanceIncludeObjectSchema.optional()), orderBy: z.union([AttendanceOrderByWithRelationInputObjectSchema, AttendanceOrderByWithRelationInputObjectSchema.array()]).optional(), where: AttendanceWhereInputObjectSchema.optional(), cursor: AttendanceWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AttendanceScalarFieldEnumSchema, AttendanceScalarFieldEnumSchema.array()]).optional() }).strict();

export const AttendanceFindFirstOrThrowZodSchema = z.object({ select: AttendanceFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => AttendanceIncludeObjectSchema.optional()), orderBy: z.union([AttendanceOrderByWithRelationInputObjectSchema, AttendanceOrderByWithRelationInputObjectSchema.array()]).optional(), where: AttendanceWhereInputObjectSchema.optional(), cursor: AttendanceWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AttendanceScalarFieldEnumSchema, AttendanceScalarFieldEnumSchema.array()]).optional() }).strict();