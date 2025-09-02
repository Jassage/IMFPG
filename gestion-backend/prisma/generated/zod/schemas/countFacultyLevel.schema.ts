import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { FacultyLevelOrderByWithRelationInputObjectSchema } from './objects/FacultyLevelOrderByWithRelationInput.schema';
import { FacultyLevelWhereInputObjectSchema } from './objects/FacultyLevelWhereInput.schema';
import { FacultyLevelWhereUniqueInputObjectSchema } from './objects/FacultyLevelWhereUniqueInput.schema';
import { FacultyLevelCountAggregateInputObjectSchema } from './objects/FacultyLevelCountAggregateInput.schema';

export const FacultyLevelCountSchema: z.ZodType<Prisma.FacultyLevelCountArgs, z.ZodTypeDef, Prisma.FacultyLevelCountArgs> = z.object({ orderBy: z.union([FacultyLevelOrderByWithRelationInputObjectSchema, FacultyLevelOrderByWithRelationInputObjectSchema.array()]).optional(), where: FacultyLevelWhereInputObjectSchema.optional(), cursor: FacultyLevelWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), FacultyLevelCountAggregateInputObjectSchema ]).optional() }).strict();

export const FacultyLevelCountZodSchema = z.object({ orderBy: z.union([FacultyLevelOrderByWithRelationInputObjectSchema, FacultyLevelOrderByWithRelationInputObjectSchema.array()]).optional(), where: FacultyLevelWhereInputObjectSchema.optional(), cursor: FacultyLevelWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), FacultyLevelCountAggregateInputObjectSchema ]).optional() }).strict();