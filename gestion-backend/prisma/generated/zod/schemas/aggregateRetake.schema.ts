import { z } from 'zod';
import { RetakeOrderByWithRelationInputObjectSchema } from './objects/RetakeOrderByWithRelationInput.schema';
import { RetakeWhereInputObjectSchema } from './objects/RetakeWhereInput.schema';
import { RetakeWhereUniqueInputObjectSchema } from './objects/RetakeWhereUniqueInput.schema';
import { RetakeCountAggregateInputObjectSchema } from './objects/RetakeCountAggregateInput.schema';
import { RetakeMinAggregateInputObjectSchema } from './objects/RetakeMinAggregateInput.schema';
import { RetakeMaxAggregateInputObjectSchema } from './objects/RetakeMaxAggregateInput.schema';
import { RetakeAvgAggregateInputObjectSchema } from './objects/RetakeAvgAggregateInput.schema';
import { RetakeSumAggregateInputObjectSchema } from './objects/RetakeSumAggregateInput.schema';

export const RetakeAggregateSchema = z.object({ orderBy: z.union([RetakeOrderByWithRelationInputObjectSchema, RetakeOrderByWithRelationInputObjectSchema.array()]).optional(), where: RetakeWhereInputObjectSchema.optional(), cursor: RetakeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), RetakeCountAggregateInputObjectSchema ]).optional(), _min: RetakeMinAggregateInputObjectSchema.optional(), _max: RetakeMaxAggregateInputObjectSchema.optional(), _avg: RetakeAvgAggregateInputObjectSchema.optional(), _sum: RetakeSumAggregateInputObjectSchema.optional() })