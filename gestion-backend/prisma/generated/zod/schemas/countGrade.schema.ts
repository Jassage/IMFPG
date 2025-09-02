import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { GradeOrderByWithRelationInputObjectSchema } from './objects/GradeOrderByWithRelationInput.schema';
import { GradeWhereInputObjectSchema } from './objects/GradeWhereInput.schema';
import { GradeWhereUniqueInputObjectSchema } from './objects/GradeWhereUniqueInput.schema';
import { GradeCountAggregateInputObjectSchema } from './objects/GradeCountAggregateInput.schema';

export const GradeCountSchema: z.ZodType<Prisma.GradeCountArgs, z.ZodTypeDef, Prisma.GradeCountArgs> = z.object({ orderBy: z.union([GradeOrderByWithRelationInputObjectSchema, GradeOrderByWithRelationInputObjectSchema.array()]).optional(), where: GradeWhereInputObjectSchema.optional(), cursor: GradeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), GradeCountAggregateInputObjectSchema ]).optional() }).strict();

export const GradeCountZodSchema = z.object({ orderBy: z.union([GradeOrderByWithRelationInputObjectSchema, GradeOrderByWithRelationInputObjectSchema.array()]).optional(), where: GradeWhereInputObjectSchema.optional(), cursor: GradeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), GradeCountAggregateInputObjectSchema ]).optional() }).strict();