import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { ScholarshipApplicationOrderByWithRelationInputObjectSchema } from './objects/ScholarshipApplicationOrderByWithRelationInput.schema';
import { ScholarshipApplicationWhereInputObjectSchema } from './objects/ScholarshipApplicationWhereInput.schema';
import { ScholarshipApplicationWhereUniqueInputObjectSchema } from './objects/ScholarshipApplicationWhereUniqueInput.schema';
import { ScholarshipApplicationCountAggregateInputObjectSchema } from './objects/ScholarshipApplicationCountAggregateInput.schema';

export const ScholarshipApplicationCountSchema: z.ZodType<Prisma.ScholarshipApplicationCountArgs, z.ZodTypeDef, Prisma.ScholarshipApplicationCountArgs> = z.object({ orderBy: z.union([ScholarshipApplicationOrderByWithRelationInputObjectSchema, ScholarshipApplicationOrderByWithRelationInputObjectSchema.array()]).optional(), where: ScholarshipApplicationWhereInputObjectSchema.optional(), cursor: ScholarshipApplicationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ScholarshipApplicationCountAggregateInputObjectSchema ]).optional() }).strict();

export const ScholarshipApplicationCountZodSchema = z.object({ orderBy: z.union([ScholarshipApplicationOrderByWithRelationInputObjectSchema, ScholarshipApplicationOrderByWithRelationInputObjectSchema.array()]).optional(), where: ScholarshipApplicationWhereInputObjectSchema.optional(), cursor: ScholarshipApplicationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ScholarshipApplicationCountAggregateInputObjectSchema ]).optional() }).strict();