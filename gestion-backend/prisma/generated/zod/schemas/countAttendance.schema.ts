import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { AttendanceOrderByWithRelationInputObjectSchema } from './objects/AttendanceOrderByWithRelationInput.schema';
import { AttendanceWhereInputObjectSchema } from './objects/AttendanceWhereInput.schema';
import { AttendanceWhereUniqueInputObjectSchema } from './objects/AttendanceWhereUniqueInput.schema';
import { AttendanceCountAggregateInputObjectSchema } from './objects/AttendanceCountAggregateInput.schema';

export const AttendanceCountSchema: z.ZodType<Prisma.AttendanceCountArgs, z.ZodTypeDef, Prisma.AttendanceCountArgs> = z.object({ orderBy: z.union([AttendanceOrderByWithRelationInputObjectSchema, AttendanceOrderByWithRelationInputObjectSchema.array()]).optional(), where: AttendanceWhereInputObjectSchema.optional(), cursor: AttendanceWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), AttendanceCountAggregateInputObjectSchema ]).optional() }).strict();

export const AttendanceCountZodSchema = z.object({ orderBy: z.union([AttendanceOrderByWithRelationInputObjectSchema, AttendanceOrderByWithRelationInputObjectSchema.array()]).optional(), where: AttendanceWhereInputObjectSchema.optional(), cursor: AttendanceWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), AttendanceCountAggregateInputObjectSchema ]).optional() }).strict();