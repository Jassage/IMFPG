import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { AnalyticsOrderByWithRelationInputObjectSchema } from './objects/AnalyticsOrderByWithRelationInput.schema';
import { AnalyticsWhereInputObjectSchema } from './objects/AnalyticsWhereInput.schema';
import { AnalyticsWhereUniqueInputObjectSchema } from './objects/AnalyticsWhereUniqueInput.schema';
import { AnalyticsCountAggregateInputObjectSchema } from './objects/AnalyticsCountAggregateInput.schema';

export const AnalyticsCountSchema: z.ZodType<Prisma.AnalyticsCountArgs, z.ZodTypeDef, Prisma.AnalyticsCountArgs> = z.object({ orderBy: z.union([AnalyticsOrderByWithRelationInputObjectSchema, AnalyticsOrderByWithRelationInputObjectSchema.array()]).optional(), where: AnalyticsWhereInputObjectSchema.optional(), cursor: AnalyticsWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), AnalyticsCountAggregateInputObjectSchema ]).optional() }).strict();

export const AnalyticsCountZodSchema = z.object({ orderBy: z.union([AnalyticsOrderByWithRelationInputObjectSchema, AnalyticsOrderByWithRelationInputObjectSchema.array()]).optional(), where: AnalyticsWhereInputObjectSchema.optional(), cursor: AnalyticsWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), AnalyticsCountAggregateInputObjectSchema ]).optional() }).strict();