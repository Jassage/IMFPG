import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { ScholarshipOrderByWithRelationInputObjectSchema } from './objects/ScholarshipOrderByWithRelationInput.schema';
import { ScholarshipWhereInputObjectSchema } from './objects/ScholarshipWhereInput.schema';
import { ScholarshipWhereUniqueInputObjectSchema } from './objects/ScholarshipWhereUniqueInput.schema';
import { ScholarshipCountAggregateInputObjectSchema } from './objects/ScholarshipCountAggregateInput.schema';

export const ScholarshipCountSchema: z.ZodType<Prisma.ScholarshipCountArgs, z.ZodTypeDef, Prisma.ScholarshipCountArgs> = z.object({ orderBy: z.union([ScholarshipOrderByWithRelationInputObjectSchema, ScholarshipOrderByWithRelationInputObjectSchema.array()]).optional(), where: ScholarshipWhereInputObjectSchema.optional(), cursor: ScholarshipWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ScholarshipCountAggregateInputObjectSchema ]).optional() }).strict();

export const ScholarshipCountZodSchema = z.object({ orderBy: z.union([ScholarshipOrderByWithRelationInputObjectSchema, ScholarshipOrderByWithRelationInputObjectSchema.array()]).optional(), where: ScholarshipWhereInputObjectSchema.optional(), cursor: ScholarshipWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ScholarshipCountAggregateInputObjectSchema ]).optional() }).strict();