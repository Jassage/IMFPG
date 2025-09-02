import { z } from 'zod';
import { AnalyticsOrderByWithRelationInputObjectSchema } from './objects/AnalyticsOrderByWithRelationInput.schema';
import { AnalyticsWhereInputObjectSchema } from './objects/AnalyticsWhereInput.schema';
import { AnalyticsWhereUniqueInputObjectSchema } from './objects/AnalyticsWhereUniqueInput.schema';
import { AnalyticsCountAggregateInputObjectSchema } from './objects/AnalyticsCountAggregateInput.schema';
import { AnalyticsMinAggregateInputObjectSchema } from './objects/AnalyticsMinAggregateInput.schema';
import { AnalyticsMaxAggregateInputObjectSchema } from './objects/AnalyticsMaxAggregateInput.schema';

export const AnalyticsAggregateSchema = z.object({ orderBy: z.union([AnalyticsOrderByWithRelationInputObjectSchema, AnalyticsOrderByWithRelationInputObjectSchema.array()]).optional(), where: AnalyticsWhereInputObjectSchema.optional(), cursor: AnalyticsWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), AnalyticsCountAggregateInputObjectSchema ]).optional(), _min: AnalyticsMinAggregateInputObjectSchema.optional(), _max: AnalyticsMaxAggregateInputObjectSchema.optional() })