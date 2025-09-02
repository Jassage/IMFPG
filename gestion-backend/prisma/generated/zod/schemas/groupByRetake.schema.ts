import { z } from 'zod';
import { RetakeWhereInputObjectSchema } from './objects/RetakeWhereInput.schema';
import { RetakeOrderByWithAggregationInputObjectSchema } from './objects/RetakeOrderByWithAggregationInput.schema';
import { RetakeScalarWhereWithAggregatesInputObjectSchema } from './objects/RetakeScalarWhereWithAggregatesInput.schema';
import { RetakeScalarFieldEnumSchema } from './enums/RetakeScalarFieldEnum.schema';
import { RetakeCountAggregateInputObjectSchema } from './objects/RetakeCountAggregateInput.schema';
import { RetakeMinAggregateInputObjectSchema } from './objects/RetakeMinAggregateInput.schema';
import { RetakeMaxAggregateInputObjectSchema } from './objects/RetakeMaxAggregateInput.schema';

export const RetakeGroupBySchema = z.object({ where: RetakeWhereInputObjectSchema.optional(), orderBy: z.union([RetakeOrderByWithAggregationInputObjectSchema, RetakeOrderByWithAggregationInputObjectSchema.array()]).optional(), having: RetakeScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(RetakeScalarFieldEnumSchema), _count: z.union([ z.literal(true), RetakeCountAggregateInputObjectSchema ]).optional(), _min: RetakeMinAggregateInputObjectSchema.optional(), _max: RetakeMaxAggregateInputObjectSchema.optional() })