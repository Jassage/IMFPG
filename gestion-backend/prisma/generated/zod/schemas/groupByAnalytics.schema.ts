import { z } from 'zod';
import { AnalyticsWhereInputObjectSchema } from './objects/AnalyticsWhereInput.schema';
import { AnalyticsOrderByWithAggregationInputObjectSchema } from './objects/AnalyticsOrderByWithAggregationInput.schema';
import { AnalyticsScalarWhereWithAggregatesInputObjectSchema } from './objects/AnalyticsScalarWhereWithAggregatesInput.schema';
import { AnalyticsScalarFieldEnumSchema } from './enums/AnalyticsScalarFieldEnum.schema';
import { AnalyticsCountAggregateInputObjectSchema } from './objects/AnalyticsCountAggregateInput.schema';
import { AnalyticsMinAggregateInputObjectSchema } from './objects/AnalyticsMinAggregateInput.schema';
import { AnalyticsMaxAggregateInputObjectSchema } from './objects/AnalyticsMaxAggregateInput.schema';

export const AnalyticsGroupBySchema = z.object({ where: AnalyticsWhereInputObjectSchema.optional(), orderBy: z.union([AnalyticsOrderByWithAggregationInputObjectSchema, AnalyticsOrderByWithAggregationInputObjectSchema.array()]).optional(), having: AnalyticsScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(AnalyticsScalarFieldEnumSchema), _count: z.union([ z.literal(true), AnalyticsCountAggregateInputObjectSchema ]).optional(), _min: AnalyticsMinAggregateInputObjectSchema.optional(), _max: AnalyticsMaxAggregateInputObjectSchema.optional() })